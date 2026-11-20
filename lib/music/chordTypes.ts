import { spellAll, type Interval } from './notes'

export interface ChordType {
  id: string
  label: string
  /** Suffix written after the root: "", "m", "6", "sus4" and so on. */
  symbol: string
  intervals: Interval[]
  /** One line on how it differs from the plain triad. */
  blurb: string
  /** Reference entry that explains this chord in depth. */
  entry?: { category: 'chords' | 'theory'; id: string }
}

/** Every chord type taught in the flow, each described from the triad it grows out of. */
export const CHORD_TYPES: ChordType[] = [
  { id: 'major', label: 'Major', symbol: '', intervals: [[1, 0], [3, 4], [5, 7]], blurb: 'The triad. Bright and stable.', entry: { category: 'chords', id: 'major-chord' } },
  { id: 'minor', label: 'Minor', symbol: 'm', intervals: [[1, 0], [3, 3], [5, 7]], blurb: 'Lower the 3rd of the major triad.', entry: { category: 'chords', id: 'minor-chord' } },
  { id: 'power', label: 'Power', symbol: '5', intervals: [[1, 0], [5, 7]], blurb: 'Drop the 3rd. Root and 5th only.', entry: { category: 'chords', id: 'power-chord' } },
  { id: 'sus2', label: 'Suspended 2nd', symbol: 'sus2', intervals: [[1, 0], [2, 2], [5, 7]], blurb: 'Replace the 3rd with the 2nd. Open and unresolved.', entry: { category: 'chords', id: 'sus2-chord' } },
  { id: 'sus4', label: 'Suspended 4th', symbol: 'sus4', intervals: [[1, 0], [4, 5], [5, 7]], blurb: 'Replace the 3rd with the 4th. Wants to resolve.', entry: { category: 'chords', id: 'sus4-chord' } },
  { id: 'sixth', label: 'Sixth', symbol: '6', intervals: [[1, 0], [3, 4], [5, 7], [6, 9]], blurb: 'Major triad plus the 6th. Warm and vintage.', entry: { category: 'chords', id: 'sixth-chord' } },
  { id: 'minor-sixth', label: 'Minor sixth', symbol: 'm6', intervals: [[1, 0], [3, 3], [5, 7], [6, 9]], blurb: 'Minor triad plus the 6th. Dark with a lift.', entry: { category: 'chords', id: 'minor-sixth-chord' } },
  { id: 'add9', label: 'Add9', symbol: 'add9', intervals: [[1, 0], [3, 4], [5, 7], [9, 14]], blurb: 'Major triad plus the 9th. Open and modern.', entry: { category: 'chords', id: 'add9-chord' } },
  { id: 'dominant7', label: 'Dominant 7th', symbol: '7', intervals: [[1, 0], [3, 4], [5, 7], [7, 10]], blurb: 'Major triad plus a flat 7th. Tension that resolves.', entry: { category: 'chords', id: 'dominant-7th' } },
  { id: 'major7', label: 'Major 7th', symbol: 'maj7', intervals: [[1, 0], [3, 4], [5, 7], [7, 11]], blurb: 'Major triad plus the 7th. Lush and smooth.', entry: { category: 'chords', id: 'major-7th' } },
  { id: 'minor7', label: 'Minor 7th', symbol: 'm7', intervals: [[1, 0], [3, 3], [5, 7], [7, 10]], blurb: 'Minor triad plus a flat 7th. Mellow and soulful.', entry: { category: 'chords', id: 'minor-7th' } },
  { id: 'diminished', label: 'Diminished', symbol: 'dim', intervals: [[1, 0], [3, 3], [5, 6]], blurb: 'Minor triad with a flat 5th. Tense and unstable.', entry: { category: 'chords', id: 'diminished' } },
  { id: 'augmented', label: 'Augmented', symbol: 'aug', intervals: [[1, 0], [3, 4], [5, 8]], blurb: 'Major triad with a raised 5th. Dreamy and restless.', entry: { category: 'chords', id: 'augmented-chord' } },
]

export function getChordType(id: string): ChordType {
  const type = CHORD_TYPES.find(t => t.id === id)
  if (!type) throw new Error(`Unknown chord type: ${id}`)
  return type
}

export interface BuiltChord {
  /** Symbol as written on a chart, for example "Am7" or "C/E". */
  name: string
  /** Chord tones, bass note first for slash chords. */
  notes: string[]
  typeId: string
}

export function buildChord(root: string, type: ChordType): BuiltChord {
  return { name: root + type.symbol, notes: spellAll(root, type.intervals), typeId: type.id }
}

/** Major or minor triad over its 3rd or 5th in the bass: C/E and C/G. */
export function buildSlashChords(root: string, type: ChordType): BuiltChord[] {
  const [r, third, fifth] = spellAll(root, type.intervals)
  return [
    { name: `${root}${type.symbol}/${third}`, notes: [third, r, fifth], typeId: 'slash' },
    { name: `${root}${type.symbol}/${fifth}`, notes: [fifth, r, third], typeId: 'slash' },
  ]
}
