import { buildChord, getChordType, type BuiltChord } from './chordTypes'
import { spellAll } from './notes'
import { MAJOR_INTERVALS, NATURAL_MINOR_INTERVALS, triadsOf, type ScaleQuality } from './scales'

export interface ProgressionStep {
  /** Scale degree of the chord root, 1 to 7, in the progression's own mode. */
  degree: number
  /** Chord type id from chordTypes.ts. */
  type: string
}

export interface PracticeProgression {
  id: string
  name: string
  /** Written as numerals, for example "I – V – vi – IV". One chord per bar. */
  numerals: string
  /** Major-key or minor-key progression. Decides which scale the degrees come from. */
  mode: ScaleQuality
  steps: ProgressionStep[]
  /** Reference entry for the progression. */
  entryId: string
}

const major = (degree: number) => ({ degree, type: 'major' })
const minor = (degree: number) => ({ degree, type: 'minor' })

export const PRACTICE_PROGRESSIONS: PracticeProgression[] = [
  { id: 'i-iv-v', name: 'Three chord trick', numerals: 'I – IV – V – I', mode: 'major', entryId: 'i-iv-v', steps: [major(1), major(4), major(5), major(1)] },
  { id: 'i-v-vi-iv', name: 'Pop axis', numerals: 'I – V – vi – IV', mode: 'major', entryId: 'i-v-vi-iv', steps: [major(1), major(5), minor(6), major(4)] },
  { id: 'i-vi-iv-v', name: 'Doo-wop', numerals: 'I – vi – IV – V', mode: 'major', entryId: 'i-vi-iv-v-50s', steps: [major(1), minor(6), major(4), major(5)] },
  { id: 'vi-iv-i-v', name: 'Minor-start pop', numerals: 'vi – IV – I – V', mode: 'major', entryId: 'vi-iv-i-v', steps: [minor(6), major(4), major(1), major(5)] },
  { id: 'ii-v-i', name: 'Jazz turnaround', numerals: 'ii7 – V7 – Imaj7', mode: 'major', entryId: 'ii-v-i', steps: [{ degree: 2, type: 'minor7' }, { degree: 5, type: 'dominant7' }, { degree: 1, type: 'major7' }, { degree: 1, type: 'major7' }] },
  { id: '12-bar-blues', name: '12-bar blues', numerals: 'I7 – IV7 – V7', mode: 'major', entryId: '12-bar-blues', steps: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5].map(degree => ({ degree, type: 'dominant7' })) },
  { id: 'blues-turnaround', name: 'Blues turnaround', numerals: 'I7 – IV7 – I7 – V7', mode: 'major', entryId: 'blues-turnaround', steps: [1, 4, 1, 5].map(degree => ({ degree, type: 'dominant7' })) },
  { id: 'andalusian', name: 'Andalusian cadence', numerals: 'i – ♭VII – ♭VI – V', mode: 'minor', entryId: 'andalusian', steps: [minor(1), major(7), major(6), major(5)] },
  { id: 'flamenco', name: 'Flamenco (rumba)', numerals: 'i – ♭VII – ♭VI – V', mode: 'minor', entryId: 'flamenco-progression', steps: [minor(1), major(7), major(6), major(5)] },
  { id: 'cinematic', name: 'Cinematic minor', numerals: 'i – ♭VI – ♭III – ♭VII', mode: 'minor', entryId: 'cinematic-minor', steps: [minor(1), major(6), major(3), major(7)] },
  { id: 'minor-ii-v-i', name: 'Minor jazz turnaround', numerals: 'iiø – V7 – i', mode: 'minor', entryId: 'ii-v-i-minor', steps: [{ degree: 2, type: 'half-diminished' }, { degree: 5, type: 'dominant7' }, minor(1), minor(1)] },
]

export function getPracticeProgression(id: string | null | undefined): PracticeProgression {
  return PRACTICE_PROGRESSIONS.find(p => p.id === id) ?? PRACTICE_PROGRESSIONS[0]
}

export function progressionForEntry(entryId: string): PracticeProgression | undefined {
  return PRACTICE_PROGRESSIONS.find(p => p.entryId === entryId)
}

/** The seven notes chord roots are taken from, for a tonic and mode. */
export function modeNotes(tonic: string, mode: ScaleQuality): string[] {
  return spellAll(tonic, mode === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS)
}

/** Write any list of steps out as chords on a tonic. */
export function chordsFromSteps(tonic: string, mode: ScaleQuality, steps: ProgressionStep[]): BuiltChord[] {
  const notes = modeNotes(tonic, mode)
  return steps.map(step => buildChord(notes[step.degree - 1], getChordType(step.type)))
}

/** Step type meaning "the triad that belongs to the scale on this degree". */
export const DIATONIC = 'diatonic'

const QUALITY_TYPE = { major: 'major', minor: 'minor', diminished: 'diminished', augmented: 'augmented' } as const

/** Resolve a step's chord type, turning DIATONIC into the scale's own triad on that degree. */
export function resolveType(notes: string[], step: ProgressionStep): string {
  return step.type === DIATONIC ? QUALITY_TYPE[triadsOf(notes)[step.degree - 1].quality] : step.type
}

/** Write steps out as chords on any seven harmony notes (see harmonyNotes in scales.ts). */
export function chordsFromNotes(notes: string[], steps: ProgressionStep[]): BuiltChord[] {
  return steps.map(step => buildChord(notes[step.degree - 1], getChordType(resolveType(notes, step))))
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const LOWER = new Set(['minor', 'minor7', 'minor-sixth', 'diminished', 'half-diminished'])
const SUFFIX: Record<string, string> = { diminished: '°', 'half-diminished': 'ø7', augmented: '+', dominant7: '7', major7: 'maj7', minor7: '7', dominant9: '9', sixth: '6', 'minor-sixth': '6' }

/** Roman numeral for a chord on a degree, with case and suffix taken from its type: V, vi, vii°, V7. */
export function numeralFor(degree: number, type: string): string {
  const base = ROMAN[degree - 1] ?? String(degree)
  return (LOWER.has(type) ? base.toLowerCase() : base) + (SUFFIX[type] ?? '')
}

export function progressionChords(tonic: string, progression: PracticeProgression): BuiltChord[] {
  return chordsFromSteps(tonic, progression.mode, progression.steps)
}
