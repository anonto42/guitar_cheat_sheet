import { pitchClass } from './notes'

/**
 * Turn chord note names (bass note first) into MIDI notes shaped like a guitar chord:
 * the first note sits low (E2 to D#3) and the rest stack upward, with octave doublings
 * until there are about six strings sounding.
 */
export function voiceChord(notes: string[]): number[] {
  const pcs = notes.map(pitchClass)
  const bass = 40 + ((pcs[0] - 40 + 120) % 12)
  const voiced = [bass]
  for (const pc of pcs.slice(1)) {
    let next = voiced[voiced.length - 1] + 1
    while (next % 12 !== pc) next++
    voiced.push(next)
  }
  for (let i = 1; voiced.length < 6; i++) voiced.push(voiced[i % voiced.length] + 12)
  return voiced.sort((a, b) => a - b).slice(0, 6)
}
