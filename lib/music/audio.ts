import type { StrumPattern } from '@/types'
import { midiToFrequency } from './notes'

export type InstrumentId = 'acoustic' | 'electric' | 'piano' | 'pad' | 'none'
export type DrumStyle = 'off' | 'rock' | 'pop' | 'half-time'

export const INSTRUMENTS: { id: InstrumentId; label: string }[] = [
  { id: 'acoustic', label: 'Acoustic guitar' },
  { id: 'electric', label: 'Electric guitar' },
  { id: 'piano', label: 'Piano' },
  { id: 'pad', label: 'Synth pad' },
  { id: 'none', label: 'No chords (play them yourself)' },
]

export const DRUM_STYLES: { id: DrumStyle; label: string }[] = [
  { id: 'off', label: 'No drums' },
  { id: 'rock', label: 'Rock beat' },
  { id: 'pop', label: 'Pop beat' },
  { id: 'half-time', label: 'Half-time ballad' },
]

export interface Mix {
  chords: number
  bass: number
  drums: number
  click: number
}

export interface PlaybackConfig {
  bpm: number
  /** MIDI notes of each bar's chord, low to high. */
  bars: number[][]
  pattern: StrumPattern
  instrument: InstrumentId
  bass: boolean
  drums: DrumStyle
  metronome: boolean
  mix: Mix
}

export interface PlaybackPosition {
  bar: number
  step: number
  /** True during the one-bar count-in. */
  countIn: boolean
}

export interface StartOptions {
  /** Play one bar of clicks before the music starts. */
  countIn?: boolean
  /** Stop after the last bar instead of looping (used for short previews). */
  loop?: boolean
  onEnd?: () => void
}

const LOOKAHEAD_SECONDS = 0.12
const TICK_MS = 25

/**
 * Practice backing band in the browser: chords with a strumming pattern, bass, drums and a click,
 * all synthesised with Web Audio (no samples to download, so it works offline). A short timer
 * schedules sound slightly ahead of the audio clock to keep timing steady.
 */
export class PracticeEngine {
  private ctx: AudioContext | null = null
  private buses: Record<keyof Mix, GainNode> | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private noise: AudioBuffer | null = null
  private wave: PeriodicWave | null = null
  private drive: WaveShaperNode | null = null
  private nextTime = 0
  private step = 0
  private bar = 0
  private counting = false
  private loop = true
  private onEnd: (() => void) | undefined

  constructor(
    private readConfig: () => PlaybackConfig,
    private onPosition: (position: PlaybackPosition | null) => void,
  ) {}

  get running(): boolean {
    return this.ctx !== null
  }

  /** The audio clock, for syncing a recording to the backing. */
  get audioContext(): AudioContext | null {
    return this.ctx
  }

  async start(options: StartOptions = {}): Promise<void> {
    if (this.ctx) return
    const Context = window.AudioContext ?? window.webkitAudioContext
    if (!Context) throw new Error('Web Audio is not supported in this browser')
    const ctx = new Context()
    await ctx.resume()

    const compressor = ctx.createDynamicsCompressor()
    const master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(compressor).connect(ctx.destination)
    const bus = () => { const g = ctx.createGain(); g.connect(master); return g }
    this.buses = { chords: bus(), bass: bus(), drums: bus(), click: bus() }

    // Plucked-string tone: a harmonic series that falls off quickly.
    const harmonics = 24
    const real = new Float32Array(harmonics)
    const imag = new Float32Array(harmonics)
    for (let n = 1; n < harmonics; n++) imag[n] = 1 / Math.pow(n, 1.35)
    this.wave = ctx.createPeriodicWave(real, imag)

    // Gentle overdrive for the electric guitar.
    this.drive = ctx.createWaveShaper()
    const curve = new Float32Array(1024)
    for (let i = 0; i < curve.length; i++) { const x = (i / (curve.length - 1)) * 2 - 1; curve[i] = Math.tanh(x * 3) }
    this.drive.curve = curve
    this.drive.connect(this.buses.chords)

    this.noise = this.createNoise(ctx)
    this.ctx = ctx
    this.step = 0
    this.bar = 0
    this.counting = options.countIn === true
    this.loop = options.loop !== false
    this.onEnd = options.onEnd
    this.nextTime = ctx.currentTime + 0.08
    this.timer = setInterval(() => this.tick(), TICK_MS)
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    void this.ctx?.close()
    this.ctx = null
    this.buses = null
    this.onPosition(null)
  }

  private tick(): void {
    const ctx = this.ctx
    if (!ctx || !this.buses) return
    const config = this.readConfig()
    for (const key of Object.keys(this.buses) as (keyof Mix)[]) this.buses[key].gain.value = config.mix[key]
    const stepsPerBar = config.pattern.steps.length
    const stepSeconds = 60 / config.bpm / config.pattern.stepsPerBeat

    while (this.nextTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      if (this.step >= stepsPerBar) this.step = 0 // pattern changed while playing
      if (this.bar >= config.bars.length) this.bar = 0

      const position = { bar: this.bar, step: this.step, countIn: this.counting }
      if (this.counting) {
        if (this.step % config.pattern.stepsPerBeat === 0) this.click(this.nextTime, this.step === 0, true)
      } else {
        this.playStep(config, position, this.nextTime, stepSeconds)
      }
      const delay = Math.max(0, (this.nextTime - ctx.currentTime) * 1000)
      setTimeout(() => { if (this.ctx) this.onPosition(position) }, delay)

      this.nextTime += stepSeconds
      this.step += 1
      if (this.step >= stepsPerBar) {
        this.step = 0
        if (this.counting) { this.counting = false; continue }
        this.bar += 1
        if (this.bar >= config.bars.length) {
          if (!this.loop) {
            const end = this.onEnd
            setTimeout(() => { this.stop(); end?.() }, delay + stepSeconds * 1000 + 600)
            if (this.timer) clearInterval(this.timer)
            this.timer = null
            return
          }
          this.bar = 0
        }
      }
    }
  }

  private playStep(config: PlaybackConfig, { bar, step }: PlaybackPosition, time: number, stepSeconds: number): void {
    const { pattern, bars, metronome, instrument } = config
    const perBeat = pattern.stepsPerBeat
    const beats = pattern.steps.length / perBeat
    if (metronome && step % perBeat === 0) this.click(time, step === 0, false)
    if (config.drums !== 'off') this.drum(config.drums, step, perBeat, beats, time)
    const notes = bars[bar]
    if (!notes?.length) return

    if (config.bass && step % perBeat === 0) {
      const beat = step / perBeat
      if (beat === 0 || beat === Math.floor(beats / 2)) this.bassNote(notes[0] - 12, time, stepSeconds * perBeat * 1.6)
    }

    if (instrument === 'none') return
    if (instrument === 'pad') {
      if (step === 0) this.pad(notes, time, stepSeconds * pattern.steps.length)
      return
    }
    switch (pattern.steps[step]) {
      case 'D': this.strum(instrument, notes, time, 'down', 0.9, false); break
      case 'U': this.strum(instrument, notes.slice(2), time, 'up', 0.5, false); break
      case 'M': this.strum(instrument, notes.slice(0, 3), time, 'down', 0.7, true); break
      case 'x': this.chop(time); break
      default: break
    }
  }

  // ─── Voices ────────────────────────────────────────────────────────────────

  private strum(instrument: InstrumentId, notes: number[], time: number, direction: 'down' | 'up', level: number, muted: boolean): void {
    const ordered = direction === 'down' ? notes : [...notes].reverse()
    const spread = instrument === 'piano' ? 0 : direction === 'down' ? 0.012 : 0.008
    const each = level / Math.sqrt(notes.length)
    ordered.forEach((midi, i) => this.note(instrument, midiToFrequency(midi), time + i * spread, each, muted))
  }

  private note(instrument: InstrumentId, frequency: number, time: number, level: number, muted: boolean): void {
    const ctx = this.ctx
    if (!ctx || !this.buses || !this.wave || !this.drive) return
    const decay = muted ? 0.16 : instrument === 'piano' ? 1.8 : instrument === 'electric' ? 1.6 : 1.3
    const osc = ctx.createOscillator()
    if (instrument === 'piano') osc.type = 'triangle'
    else osc.setPeriodicWave(this.wave)
    osc.frequency.value = frequency
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    const bright = muted ? 900 : instrument === 'electric' ? 3200 : instrument === 'piano' ? 2400 : 4200
    filter.frequency.setValueAtTime(bright, time)
    filter.frequency.exponentialRampToValueAtTime(Math.max(250, bright * 0.2), time + decay)
    const gain = ctx.createGain()
    const peak = level * (instrument === 'electric' ? 0.22 : 0.4)
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(peak, time + (instrument === 'piano' ? 0.006 : 0.003))
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay)
    osc.connect(filter).connect(gain).connect(instrument === 'electric' ? this.drive : this.buses.chords)
    osc.start(time)
    osc.stop(time + decay + 0.05)
  }

  private pad(notes: number[], time: number, length: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses) return
    for (const midi of notes.slice(0, 4)) {
      for (const detune of [-7, 7]) {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = midiToFrequency(midi + 12)
        osc.detune.value = detune
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 1100
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(0.035, time + 0.35)
        gain.gain.setValueAtTime(0.035, time + Math.max(0.4, length - 0.3))
        gain.gain.linearRampToValueAtTime(0.0001, time + length + 0.2)
        osc.connect(filter).connect(gain).connect(this.buses.chords)
        osc.start(time)
        osc.stop(time + length + 0.3)
      }
    }
  }

  private bassNote(midi: number, time: number, length: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses) return
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = midiToFrequency(Math.max(28, midi))
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 700
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.5, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(length, 1.2))
    osc.connect(filter).connect(gain).connect(this.buses.bass)
    osc.start(time)
    osc.stop(time + Math.min(length, 1.2) + 0.05)
  }

  private drum(style: DrumStyle, step: number, perBeat: number, beats: number, time: number): void {
    const onBeat = step % perBeat === 0
    const beat = Math.floor(step / perBeat)
    const half = perBeat === 4 ? 2 : 1 // eighth-note position inside a 16th grid
    if (step % half === 0) this.hat(time, onBeat ? 0.09 : 0.05)
    if (!onBeat) {
      if (style === 'pop' && beat === 1 && step % perBeat === half) this.kick(time)
      return
    }
    if (beats === 3) { // 3/4
      if (beat === 0) this.kick(time)
      else this.snare(time, beat === 2 ? 0.5 : 0.3)
      return
    }
    if (beats === 2) { // 6/8 feels like two big beats
      if (beat === 0) this.kick(time)
      else this.snare(time, 0.5)
      return
    }
    if (style === 'half-time') {
      if (beat === 0) this.kick(time)
      if (beat === 2) this.snare(time, 0.55)
      return
    }
    if (beat === 0 || beat === 2) this.kick(time)
    if (beat === 1 || beat === 3) this.snare(time, 0.5)
  }

  private kick(time: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses) return
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(140, time)
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.18)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.9, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35)
    osc.connect(gain).connect(this.buses.drums)
    osc.start(time)
    osc.stop(time + 0.4)
  }

  private snare(time: number, level: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses || !this.noise) return
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1800
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(level, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18)
    source.connect(filter).connect(gain).connect(this.buses.drums)
    source.start(time)
    source.stop(time + 0.2)
  }

  private hat(time: number, level: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses || !this.noise) return
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 7000
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(level, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    source.connect(filter).connect(gain).connect(this.buses.drums)
    source.start(time)
    source.stop(time + 0.06)
  }

  private chop(time: number): void {
    const ctx = this.ctx
    if (!ctx || !this.buses || !this.noise) return
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.18, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    source.connect(filter).connect(gain).connect(this.buses.chords)
    source.start(time)
    source.stop(time + 0.06)
  }

  private click(time: number, accent: boolean, countIn: boolean): void {
    const ctx = this.ctx
    if (!ctx || !this.buses) return
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = accent ? 1600 : 1100
    const gain = ctx.createGain()
    const level = (accent ? 0.12 : 0.07) * (countIn ? 1.3 : 1)
    gain.gain.setValueAtTime(level, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035)
    osc.connect(gain).connect(countIn ? (this.ctx as AudioContext).destination : this.buses.click)
    osc.start(time)
    osc.stop(time + 0.04)
  }

  private createNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }
}

export const DEFAULT_MIX: Mix = { chords: 0.9, bass: 0.7, drums: 0.6, click: 0.6 }
