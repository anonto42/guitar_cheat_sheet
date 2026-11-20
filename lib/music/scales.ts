import { pitchClass, spell, spellAll, type Interval } from './notes'

export type ScaleQuality = 'major' | 'minor'

export interface ScaleDef {
  /** Interval list from the root. */
  intervals: Interval[]
  quality: ScaleQuality
  /** Which triads sound right under this scale when it is not a 7-note scale. */
  parent?: 'major' | 'natural-minor' | 'whole-tone' | 'diminished'
}

const MAJOR: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 11]]
const NATURAL_MINOR: Interval[] = [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 8], [7, 10]]
const HARMONIC_MINOR: Interval[] = [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 8], [7, 11]]
const MELODIC_MINOR: Interval[] = [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 9], [7, 11]]
const DORIAN: Interval[] = [[1, 0], [2, 2], [3, 3], [4, 5], [5, 7], [6, 9], [7, 10]]
const PHRYGIAN: Interval[] = [[1, 0], [2, 1], [3, 3], [4, 5], [5, 7], [6, 8], [7, 10]]
const LYDIAN: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 6], [5, 7], [6, 9], [7, 11]]
const MIXOLYDIAN: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 10]]
const LOCRIAN: Interval[] = [[1, 0], [2, 1], [3, 3], [4, 5], [5, 6], [6, 8], [7, 10]]
const MINOR_PENT: Interval[] = [[1, 0], [3, 3], [4, 5], [5, 7], [7, 10]]
const MAJOR_PENT: Interval[] = [[1, 0], [2, 2], [3, 4], [5, 7], [6, 9]]
const BLUES: Interval[] = [[1, 0], [3, 3], [4, 5], [5, 6], [5, 7], [7, 10]]
const WHOLE_TONE: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 6], [5, 8], [7, 10]]
const DIMINISHED: Interval[] = [[1, 0], [2, 2], [3, 3], [4, 5], [5, 6], [6, 8], [6, 9], [7, 11]]
const PHRYGIAN_DOMINANT: Interval[] = [[1, 0], [2, 1], [3, 4], [4, 5], [5, 7], [6, 8], [7, 10]]
const LYDIAN_DOMINANT: Interval[] = [[1, 0], [2, 2], [3, 4], [4, 6], [5, 7], [6, 9], [7, 10]]
const SUPER_LOCRIAN: Interval[] = [[1, 0], [2, 1], [3, 3], [4, 4], [5, 6], [6, 8], [7, 10]]

/** Every scale-like entry in the library, by entry id. Solo guides reuse the scale they teach. */
export const SCALE_CATALOG: Record<string, ScaleDef> = {
  'major-scale': { intervals: MAJOR, quality: 'major' },
  'ionian': { intervals: MAJOR, quality: 'major' },
  'major-scale-solo': { intervals: MAJOR, quality: 'major' },
  'natural-minor': { intervals: NATURAL_MINOR, quality: 'minor' },
  'aeolian-mode': { intervals: NATURAL_MINOR, quality: 'minor' },
  'natural-minor-solo': { intervals: NATURAL_MINOR, quality: 'minor' },
  'harmonic-minor': { intervals: HARMONIC_MINOR, quality: 'minor' },
  'harmonic-minor-solo': { intervals: HARMONIC_MINOR, quality: 'minor' },
  'melodic-minor': { intervals: MELODIC_MINOR, quality: 'minor' },
  'dorian-minor': { intervals: DORIAN, quality: 'minor' },
  'dorian-mode': { intervals: DORIAN, quality: 'minor' },
  'dorian-solo': { intervals: DORIAN, quality: 'minor' },
  'phrygian-mode': { intervals: PHRYGIAN, quality: 'minor' },
  'lydian-mode': { intervals: LYDIAN, quality: 'major' },
  'mixolydian-mode': { intervals: MIXOLYDIAN, quality: 'major' },
  'mixolydian-solo': { intervals: MIXOLYDIAN, quality: 'major' },
  'locrian-mode': { intervals: LOCRIAN, quality: 'minor' },
  'minor-pentatonic': { intervals: MINOR_PENT, quality: 'minor', parent: 'natural-minor' },
  'pentatonic-minor-solo': { intervals: MINOR_PENT, quality: 'minor', parent: 'natural-minor' },
  'major-pentatonic': { intervals: MAJOR_PENT, quality: 'major', parent: 'major' },
  'major-pentatonic-solo': { intervals: MAJOR_PENT, quality: 'major', parent: 'major' },
  'blues-scale': { intervals: BLUES, quality: 'minor', parent: 'natural-minor' },
  'blues-scale-solo': { intervals: BLUES, quality: 'minor', parent: 'natural-minor' },
  'whole-tone': { intervals: WHOLE_TONE, quality: 'major', parent: 'whole-tone' },
  'whole-tone-solo': { intervals: WHOLE_TONE, quality: 'major', parent: 'whole-tone' },
  'diminished-scale': { intervals: DIMINISHED, quality: 'minor', parent: 'diminished' },
  'diminished-solo': { intervals: DIMINISHED, quality: 'minor', parent: 'diminished' },
  'phrygian-dominant': { intervals: PHRYGIAN_DOMINANT, quality: 'major' },
  'lydian-dominant': { intervals: LYDIAN_DOMINANT, quality: 'major' },
  'super-locrian': { intervals: SUPER_LOCRIAN, quality: 'minor' },
  'pentatonic-positions': { intervals: MINOR_PENT, quality: 'minor', parent: 'natural-minor' },
}

export const NATURAL_MINOR_INTERVALS = NATURAL_MINOR
export const MAJOR_INTERVALS = MAJOR

// ─── Roots ───────────────────────────────────────────────────────────────────

/** The 12 roots, spelled the way players usually write major-type and minor-type keys. */
export const ROOTS: Record<ScaleQuality, string[]> = {
  major: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'],
  minor: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
}

export function rootSlug(root: string): string {
  return root.toLowerCase().replace('♯', '-sharp').replace('♭', '-flat')
}

/** Find the root for a slug (or a pitch match), spelled for the given quality. */
export function rootFromSlug(slug: string | null | undefined, quality: ScaleQuality, fallback: string): string {
  if (!slug) return fallback
  const roots = ROOTS[quality]
  const exact = roots.find(r => rootSlug(r) === slug)
  if (exact) return exact
  // Accept the enharmonic spelling too: "c-sharp" on a major-type page picks D♭.
  const all = [...ROOTS.major, ...ROOTS.minor]
  const any = all.find(r => rootSlug(r) === slug)
  if (!any) return fallback
  const pc = pitchClass(any)
  return roots.find(r => pitchClass(r) === pc) ?? fallback
}

/** Normalise any note name (for example "Bb" or "G♭") to the spelling used by the root list. */
export function normaliseRoot(name: string, quality: ScaleQuality): string {
  const clean = name.replace('#', '♯').replace(/^([A-G])b/, '$1♭')
  const pc = pitchClass(clean)
  return ROOTS[quality].find(r => pitchClass(r) === pc) ?? 'C'
}

export function scaleNotes(root: string, def: ScaleDef): string[] {
  return spellAll(root, def.intervals)
}

// ─── Chords that belong to a scale ───────────────────────────────────────────

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export interface ScaleChord {
  numeral: string
  name: string
  notes: string[]
  quality: 'major' | 'minor' | 'diminished' | 'augmented'
}

function qualityOf(root: string, third: string, fifth: string): ScaleChord['quality'] {
  const t = (pitchClass(third) - pitchClass(root) + 12) % 12
  const f = (pitchClass(fifth) - pitchClass(root) + 12) % 12
  if (t === 4 && f === 8) return 'augmented'
  if (t === 4) return 'major'
  if (f === 6) return 'diminished'
  return 'minor'
}

const SUFFIX: Record<ScaleChord['quality'], string> = { major: '', minor: 'm', diminished: 'dim', augmented: 'aug' }

/** Stack thirds on each note of a 7-note scale. */
export function triadsOf(notes: string[]): ScaleChord[] {
  return notes.map((root, i) => {
    const third = notes[(i + 2) % notes.length]
    const fifth = notes[(i + 4) % notes.length]
    const quality = qualityOf(root, third, fifth)
    const roman = ROMAN[i] ?? String(i + 1)
    const numeral = quality === 'major' || quality === 'augmented'
      ? roman + (quality === 'augmented' ? '+' : '')
      : roman.toLowerCase() + (quality === 'diminished' ? '°' : '')
    return { numeral, name: root + SUFFIX[quality], notes: [root, third, fifth], quality }
  })
}

/** The chords to play under a scale in a given root. */
export function chordsForScale(root: string, def: ScaleDef): ScaleChord[] {
  if (def.intervals.length === 7) return triadsOf(scaleNotes(root, def))
  switch (def.parent) {
    case 'major': return triadsOf(spellAll(root, MAJOR))
    case 'natural-minor': return triadsOf(spellAll(root, NATURAL_MINOR))
    case 'whole-tone':
      return scaleNotes(root, def).map((n, i) => ({ numeral: String(i + 1), name: `${n}aug`, notes: [n, spell(n, 3, 4), spell(n, 5, 8)], quality: 'augmented' as const }))
    case 'diminished':
      return scaleNotes(root, def).filter((_, i) => i % 2 === 0).map((n, i) => ({ numeral: String(i + 1), name: `${n}dim`, notes: [n, spell(n, 3, 3), spell(n, 5, 6)], quality: 'diminished' as const }))
    default: return []
  }
}

// ─── Positions ───────────────────────────────────────────────────────────────

export interface ScalePosition {
  index: number
  start: number
  end: number
}

/**
 * Fret windows that cover the scale across the neck, one starting at each scale note on the
 * low E string. For the pentatonic this gives the familiar five boxes.
 */
export function scalePositions(notes: string[], maxFret = 15): ScalePosition[] {
  const width = notes.length <= 6 ? 3 : 4
  const pcs = new Set(notes.map(pitchClass))
  const starts: number[] = []
  for (let fret = 0; fret <= 12; fret++) if (pcs.has((4 + fret) % 12)) starts.push(fret)
  return starts
    .filter(s => s + width <= maxFret)
    .slice(0, notes.length)
    .map((start, i) => ({ index: i + 1, start, end: start + width }))
}

// ─── Scales a player can choose in tools ─────────────────────────────────────

export interface ScaleChoice {
  id: string
  label: string
  group: 'Scales' | 'Modes'
}

/** Every scale and mode from the library that can be used as a home key in tools. */
export const SCALE_CHOICES: ScaleChoice[] = [
  { id: 'major-scale', label: 'Major (Ionian)', group: 'Scales' },
  { id: 'natural-minor', label: 'Natural minor (Aeolian)', group: 'Scales' },
  { id: 'harmonic-minor', label: 'Harmonic minor', group: 'Scales' },
  { id: 'melodic-minor', label: 'Melodic minor', group: 'Scales' },
  { id: 'major-pentatonic', label: 'Major pentatonic', group: 'Scales' },
  { id: 'minor-pentatonic', label: 'Minor pentatonic', group: 'Scales' },
  { id: 'blues-scale', label: 'Blues', group: 'Scales' },
  { id: 'phrygian-dominant', label: 'Phrygian dominant', group: 'Scales' },
  { id: 'lydian-dominant', label: 'Lydian dominant', group: 'Scales' },
  { id: 'whole-tone', label: 'Whole tone', group: 'Scales' },
  { id: 'diminished-scale', label: 'Diminished (whole-half)', group: 'Scales' },
  { id: 'super-locrian', label: 'Super Locrian (altered)', group: 'Scales' },
  { id: 'dorian-mode', label: 'Dorian', group: 'Modes' },
  { id: 'phrygian-mode', label: 'Phrygian', group: 'Modes' },
  { id: 'lydian-mode', label: 'Lydian', group: 'Modes' },
  { id: 'mixolydian-mode', label: 'Mixolydian', group: 'Modes' },
  { id: 'locrian-mode', label: 'Locrian', group: 'Modes' },
]

export function scaleChoice(id: string | null | undefined): ScaleChoice {
  return SCALE_CHOICES.find(s => s.id === id) ?? SCALE_CHOICES[0]
}

/**
 * The seven notes chords are built from for a scale. 7-note scales use their own notes;
 * pentatonic, blues and symmetrical scales borrow the major or natural minor scale they sit in.
 */
export function harmonyNotes(root: string, def: ScaleDef): string[] {
  if (def.intervals.length === 7) return scaleNotes(root, def)
  if (def.parent === 'major' || (def.parent !== 'natural-minor' && def.quality === 'major')) return spellAll(root, MAJOR)
  return spellAll(root, NATURAL_MINOR)
}
