import { buildChord, getChordType, type BuiltChord } from './chordTypes'
import type { MajorKey } from './keys'

export interface PracticeProgression {
  id: string
  name: string
  /** Written as numerals, for example "I – V – vi – IV". One chord per bar. */
  numerals: string
  steps: { degree: number; type: string }[]
  /** Reference entry for the progression. */
  entryId: string
}

export const PRACTICE_PROGRESSIONS: PracticeProgression[] = [
  {
    id: 'i-iv-v', name: 'Three chord trick', numerals: 'I – IV – V', entryId: 'i-iv-v',
    steps: [{ degree: 1, type: 'major' }, { degree: 4, type: 'major' }, { degree: 5, type: 'major' }, { degree: 1, type: 'major' }],
  },
  {
    id: 'i-v-vi-iv', name: 'Pop axis', numerals: 'I – V – vi – IV', entryId: 'i-v-vi-iv',
    steps: [{ degree: 1, type: 'major' }, { degree: 5, type: 'major' }, { degree: 6, type: 'minor' }, { degree: 4, type: 'major' }],
  },
  {
    id: 'i-vi-iv-v', name: 'Doo-wop', numerals: 'I – vi – IV – V', entryId: 'i-vi-iv-v-50s',
    steps: [{ degree: 1, type: 'major' }, { degree: 6, type: 'minor' }, { degree: 4, type: 'major' }, { degree: 5, type: 'major' }],
  },
  {
    id: 'vi-iv-i-v', name: 'Minor-start pop', numerals: 'vi – IV – I – V', entryId: 'vi-iv-i-v',
    steps: [{ degree: 6, type: 'minor' }, { degree: 4, type: 'major' }, { degree: 1, type: 'major' }, { degree: 5, type: 'major' }],
  },
  {
    id: 'ii-v-i', name: 'Jazz turnaround', numerals: 'ii7 – V7 – Imaj7', entryId: 'ii-v-i',
    steps: [{ degree: 2, type: 'minor7' }, { degree: 5, type: 'dominant7' }, { degree: 1, type: 'major7' }, { degree: 1, type: 'major7' }],
  },
  {
    id: '12-bar-blues', name: '12-bar blues', numerals: 'I7 – IV7 – V7', entryId: '12-bar-blues',
    steps: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5].map(degree => ({ degree, type: 'dominant7' })),
  },
]

export function getPracticeProgression(id: string): PracticeProgression {
  return PRACTICE_PROGRESSIONS.find(p => p.id === id) ?? PRACTICE_PROGRESSIONS[0]
}

/** The chords of a progression written out in a specific key. */
export function progressionChords(key: MajorKey, progression: PracticeProgression): BuiltChord[] {
  return progression.steps.map(step => buildChord(key.notes[step.degree - 1], getChordType(step.type)))
}
