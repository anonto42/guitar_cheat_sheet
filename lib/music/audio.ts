import type { StrumPattern } from '@/types'
import { midiToFrequency } from './notes'

export interface PlaybackConfig {
  bpm: number
  /** MIDI notes for each bar's chord, low to high. */
  chords: number[][]
  pattern: StrumPattern
  metronome: boolean
}

export interface PlaybackPosition {
  bar: number
  step: number
}

const LOOKAHEAD_SECONDS = 0.12
const TICK_MS = 25

/**
 * Plays a chord progression with a strumming pattern and an optional click, using Web Audio.
 * A short timer schedules audio slightly ahead of the clock so timing stays steady even when
 * the page is busy. Browser only. Nothing is downloaded: every sound is synthesised.
 */
export class PracticeEngine {
  private ctx: AudioContext | null = null
  private output: AudioNode | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private nextTime = 0
  private step = 0
  private bar = 0
  private noise: AudioBuffer | null = null

  constructor(
    private readConfig: () => PlaybackConfig,
    private onPosition: (position: PlaybackPosition | null) => void,
  ) {}

  get running(): boolean {
    return this.ctx !== null
  }

  async start(): Promise<void> {
    if (this.ctx) return
    const Context = window.AudioContext ?? window.webkitAudioContext
    if (!Context) throw new Error('Web Audio is not supported in this browser')
    const ctx = new Context()
    await ctx.resume()

    const compressor = ctx.createDynamicsCompressor()
    const master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(compressor).connect(ctx.destination)

    this.ctx = ctx
    this.output = master
    this.noise = this.createNoise(ctx)
    this.step = 0
    this.bar = 0
    this.nextTime = ctx.currentTime + 0.08
    this.timer = setInterval(() => this.tick(), TICK_MS)
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    void this.ctx?.close()
    this.ctx = null
    this.output = null
    this.onPosition(null)
  }

  private tick(): void {
    const ctx = this.ctx
    if (!ctx) return
    const config = this.readConfig()
    const stepsPerBar = config.pattern.steps.length
    const stepSeconds = 60 / config.bpm / config.pattern.stepsPerBeat

    while (this.nextTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      if (this.step >= stepsPerBar) this.step = 0 // pattern changed while playing
      if (this.bar >= config.chords.length) this.bar = 0

      const position = { bar: this.bar, step: this.step }
      this.playStep(config, position, this.nextTime)
      const delay = Math.max(0, (this.nextTime - ctx.currentTime) * 1000)
      setTimeout(() => { if (this.ctx) this.onPosition(position) }, delay)

      this.nextTime += stepSeconds
      this.step += 1
      if (this.step >= stepsPerBar) {
        this.step = 0
        this.bar = (this.bar + 1) % config.chords.length
      }
    }
  }

  private playStep(config: PlaybackConfig, { bar, step }: PlaybackPosition, time: number): void {
    const { pattern, chords, metronome } = config
    if (metronome && step % pattern.stepsPerBeat === 0) this.click(time, step === 0)
    const notes = chords[bar]
    switch (pattern.steps[step]) {
      case 'D': this.strum(notes, time, 'down', 0.9, 1.6, 2600); break
      case 'U': this.strum(notes.slice(2), time, 'up', 0.5, 1.0, 3000); break
      case 'M': this.strum(notes, time, 'down', 0.7, 0.14, 900); break
      case 'x': this.chop(time); break
      default: break
    }
  }

  private strum(notes: number[], time: number, direction: 'down' | 'up', level: number, decay: number, cutoff: number): void {
    const ordered = direction === 'down' ? notes : [...notes].reverse()
    ordered.forEach((midi, i) => this.pluck(midiToFrequency(midi), time + i * 0.011, level / Math.sqrt(notes.length), decay, cutoff))
  }

  private pluck(frequency: number, time: number, level: number, decay: number, cutoff: number): void {
    const ctx = this.ctx
    if (!ctx || !this.output) return
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = frequency
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(cutoff, time)
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, cutoff * 0.25), time + decay)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(level * 0.35, time + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay)
    osc.connect(filter).connect(gain).connect(this.output)
    osc.start(time)
    osc.stop(time + decay + 0.05)
  }

  private chop(time: number): void {
    const ctx = this.ctx
    if (!ctx || !this.output || !this.noise) return
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.18, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    source.connect(filter).connect(gain).connect(this.output)
    source.start(time)
    source.stop(time + 0.06)
  }

  private click(time: number, accent: boolean): void {
    const ctx = this.ctx
    if (!ctx || !this.output) return
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = accent ? 1600 : 1100
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(accent ? 0.12 : 0.07, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035)
    osc.connect(gain).connect(this.output)
    osc.start(time)
    osc.stop(time + 0.04)
  }

  private createNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }
}
