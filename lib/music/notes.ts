/**
 * Note spelling helpers. Notes are spelled by letter (F♯ in G major, never G♭), which is what
 * players expect on a chart. All functions are pure.
 */

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const NATURAL: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** [scale degree counted from the root (1 to 13), semitones above the root]. */
export type Interval = readonly [degree: number, semitones: number]

export const MAJOR_SCALE_INTERVALS: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 11]]

export function parseNote(name: string): { letter: string; accidental: number } {
  let accidental = 0
  for (const ch of name.slice(1)) {
    if (ch === '♯' || ch === '#') accidental++
    else if (ch === '♭' || ch === 'b') accidental--
  }
  return { letter: name[0], accidental }
}

/** Pitch class: 0 for C up to 11 for B. */
export function pitchClass(name: string): number {
  const { letter, accidental } = parseNote(name)
  return (((NATURAL[letter] + accidental) % 12) + 12) % 12
}

function accidentalSymbols(count: number): string {
  return count > 0 ? '♯'.repeat(count) : '♭'.repeat(-count)
}

/** The note `semitones` above `root`, written on the letter that is `degree` steps away. */
export function spell(root: string, degree: number, semitones: number): string {
  const { letter } = parseNote(root)
  const target = LETTERS[(LETTERS.indexOf(letter as (typeof LETTERS)[number]) + degree - 1) % 7]
  const pc = (pitchClass(root) + semitones) % 12
  const accidental = ((((pc - NATURAL[target]) + 6) % 12) + 12) % 12 - 6
  return target + accidentalSymbols(accidental)
}

export function spellAll(root: string, intervals: readonly Interval[]): string[] {
  return intervals.map(([degree, semitones]) => spell(root, degree, semitones))
}

/** Concert pitch frequency for a MIDI note number. */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}
