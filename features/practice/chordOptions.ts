import { buildChord, getChordType } from '@/lib/music/chordTypes'
import { pitchClass } from '@/lib/music/notes'
import { DIATONIC, numeralFor, type ProgressionStep } from '@/lib/music/progressions'
import { triadsOf } from '@/lib/music/scales'

export interface ChordOption extends ProgressionStep {
  /** Value used in a select: "degree:type". */
  value: string
  label: string
  group: string
}

const TRIAD_TYPE = { major: 'major', minor: 'minor', diminished: 'diminished', augmented: 'augmented' } as const

/** The 7th chord type built from four scale notes, or null when the library has no matching type. */
function seventhType(root: string, third: string, fifth: string, seventh: string): string | null {
  const t = (pitchClass(third) - pitchClass(root) + 12) % 12
  const f = (pitchClass(fifth) - pitchClass(root) + 12) % 12
  const s = (pitchClass(seventh) - pitchClass(root) + 12) % 12
  if (t === 4 && f === 7 && s === 11) return 'major7'
  if (t === 4 && f === 7 && s === 10) return 'dominant7'
  if (t === 3 && f === 7 && s === 10) return 'minor7'
  if (t === 3 && f === 6 && s === 10) return 'half-diminished'
  return null
}

export const stepValue = (step: ProgressionStep) => `${step.degree}:${step.type}`

export function parseStep(value: string): ProgressionStep {
  const [degree, type] = value.split(':')
  return { degree: Number(degree), type }
}

/**
 * Chords a player can put in a bar, built on seven harmony notes: the scale's own triad and 7th
 * chord on every degree, plus major, minor and dominant 7th for blues and borrowed sounds.
 */
export function chordOptions(notes: string[]): ChordOption[] {
  const triads = triadsOf(notes)
  const own: ChordOption[] = []
  const borrowed: ChordOption[] = []
  triads.forEach((triad, i) => {
    const degree = i + 1
    // The chord that belongs to the scale. It follows the scale if the scale changes.
    own.push({ degree, type: DIATONIC, value: `${degree}:${DIATONIC}`, label: `${triad.name}   ${triad.numeral}`, group: 'In the scale' })
    const seventh = seventhType(notes[i], notes[(i + 2) % 7], notes[(i + 4) % 7], notes[(i + 6) % 7])
    if (seventh) {
      const chord = buildChord(notes[i], getChordType(seventh))
      own.push({ degree, type: seventh, value: `${degree}:${seventh}`, label: `${chord.name}   ${numeralFor(degree, seventh)}`, group: 'In the scale' })
    }
    // Borrowed chords are common: the major V in a minor key, a minor iv in a major key.
    for (const type of ['major', 'minor', 'dominant7'].filter(t => t !== TRIAD_TYPE[triad.quality] && t !== seventh)) {
      const chord = buildChord(notes[i], getChordType(type))
      borrowed.push({ degree, type, value: `${degree}:${type}`, label: `${chord.name}   ${numeralFor(degree, type)}`, group: 'Borrowed from other keys' })
    }
  })
  return [...own, ...borrowed]
}
