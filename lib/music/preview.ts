import { midiToFrequency } from './notes'

let ctx: AudioContext | null = null

/**
 * Play one chord once, strummed, for "tap to hear" buttons. Separate from the practice engine
 * so it works while the loop is stopped. Browser only.
 */
export function previewChord(midiNotes: number[]): void {
  const Context = typeof window === 'undefined' ? undefined : (window.AudioContext ?? window.webkitAudioContext)
  if (!Context) return
  ctx ??= new Context()
  void ctx.resume()
  const now = ctx.currentTime + 0.02
  const level = 0.5 / Math.sqrt(midiNotes.length)
  midiNotes.forEach((midi, i) => {
    const c = ctx as AudioContext
    const t = now + i * 0.018
    const osc = c.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = midiToFrequency(midi)
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3200, t)
    filter.frequency.exponentialRampToValueAtTime(600, t + 1.2)
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(level, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    osc.connect(filter).connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + 1.5)
  })
}
