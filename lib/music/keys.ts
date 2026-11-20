import { KEYS_DATA } from '@/data/musicHelpers'
import { pitchClass, spell } from './notes'

export interface MajorKey {
  slug: string
  /** Tonic, for example "F♯". */
  root: string
  /** Display name, for example "F♯ major". */
  name: string
  notes: string[]
  sharps: number
  flats: number
}

/** Circle of fifths order. */
const KEY_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'F', 'B♭', 'E♭', 'A♭', 'D♭']

export function keySlug(root: string): string {
  return root.toLowerCase().replace('♯', '-sharp').replace('♭', '-flat')
}

export const MAJOR_KEYS: MajorKey[] = KEY_ORDER.map(root => ({
  slug: keySlug(root),
  root,
  name: `${root} major`,
  notes: KEYS_DATA[root].notes,
  sharps: KEYS_DATA[root].sharps,
  flats: KEYS_DATA[root].flats,
}))

export function getMajorKey(slug: string): MajorKey | undefined {
  return MAJOR_KEYS.find(k => k.slug === slug)
}

export function signatureLabel(key: MajorKey): string {
  if (key.sharps) return `${key.sharps} sharp${key.sharps > 1 ? 's' : ''}`
  if (key.flats) return `${key.flats} flat${key.flats > 1 ? 's' : ''}`
  return 'No sharps or flats'
}

// ─── Modes ───────────────────────────────────────────────────────────────────

const MODE_INFO = [
  { name: 'Ionian', entryId: 'ionian', feel: 'Bright and resolved. The major scale itself.', pattern: 'W W H W W W H' },
  { name: 'Dorian', entryId: 'dorian-mode', feel: 'Minor with a lift. Jazzy and soulful.', pattern: 'W H W W W H W' },
  { name: 'Phrygian', entryId: 'phrygian-mode', feel: 'Dark and Spanish. Flamenco and metal.', pattern: 'H W W W H W W' },
  { name: 'Lydian', entryId: 'lydian-mode', feel: 'Dreamy and floating. Film-score magic.', pattern: 'W W W H W W H' },
  { name: 'Mixolydian', entryId: 'mixolydian-mode', feel: 'Major with a bluesy edge. Rock and funk.', pattern: 'W W H W W H W' },
  { name: 'Aeolian', entryId: 'aeolian-mode', feel: 'The natural minor scale. Sad and powerful.', pattern: 'W H W W H W W' },
  { name: 'Locrian', entryId: 'locrian-mode', feel: 'Unstable and tense. Rarely a home base.', pattern: 'H W W H W W W' },
] as const

export interface KeyMode {
  degree: number
  name: string
  /** Note the mode starts on. */
  root: string
  notes: string[]
  feel: string
  pattern: string
  entryId: string
}

/** The seven modes that share this key's notes, each starting on a different degree. */
export function modesOfKey(key: MajorKey): KeyMode[] {
  return MODE_INFO.map((info, i) => ({
    degree: i + 1,
    name: info.name,
    root: key.notes[i],
    notes: [...key.notes.slice(i), ...key.notes.slice(0, i)],
    feel: info.feel,
    pattern: info.pattern,
    entryId: info.entryId,
  }))
}

// ─── Triads ──────────────────────────────────────────────────────────────────

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export interface KeyTriad {
  degree: number
  numeral: string
  name: string
  notes: string[]
  quality: 'major' | 'minor' | 'diminished'
  entryId: string
}

/** Stack thirds on every note of the scale to get the seven triads of the key. */
export function triadsOfKey(key: MajorKey): KeyTriad[] {
  return key.notes.map((root, i) => {
    const third = key.notes[(i + 2) % 7]
    const fifth = key.notes[(i + 4) % 7]
    const thirdSize = (pitchClass(third) - pitchClass(root) + 12) % 12
    const fifthSize = (pitchClass(fifth) - pitchClass(root) + 12) % 12
    const quality = thirdSize === 4 ? 'major' : fifthSize === 6 ? 'diminished' : 'minor'
    const numeral = quality === 'major' ? ROMAN[i] : ROMAN[i].toLowerCase() + (quality === 'diminished' ? '°' : '')
    const name = root + (quality === 'major' ? '' : quality === 'minor' ? 'm' : 'dim')
    const entryId = quality === 'major' ? 'major-chord' : quality === 'minor' ? 'minor-chord' : 'diminished'
    return { degree: i + 1, numeral, name, notes: [root, third, fifth], quality, entryId }
  })
}

// ─── Soloing ─────────────────────────────────────────────────────────────────

export interface SoloScale {
  id: string
  label: string
  notes: string[]
  /** Which note to highlight as the home note. */
  tonic: string
  why: string
  guide: { category: 'solos' | 'scales'; id: string }
}

/** The scales that sound right over the chords of this major key. */
export function soloScales(key: MajorKey): SoloScale[] {
  const n = key.notes
  const minorRoot = n[5]
  return [
    {
      id: 'major-pentatonic',
      label: `${key.root} major pentatonic`,
      notes: [n[0], n[1], n[2], n[4], n[5]],
      tonic: n[0],
      why: 'Five bright notes. Safe over every chord of the key.',
      guide: { category: 'solos', id: 'major-pentatonic-solo' },
    },
    {
      id: 'minor-pentatonic',
      label: `${minorRoot} minor pentatonic`,
      notes: [minorRoot, n[0], n[1], n[2], n[4]],
      tonic: minorRoot,
      why: `The relative minor. Same notes, but ${minorRoot} sounds like home.`,
      guide: { category: 'solos', id: 'pentatonic-minor-solo' },
    },
    {
      id: 'blues',
      label: `${minorRoot} blues`,
      notes: [minorRoot, n[0], n[1], spell(minorRoot, 5, 6), n[2], n[4]],
      tonic: minorRoot,
      why: 'Minor pentatonic plus the blue note. Pass through it, never rest on it.',
      guide: { category: 'solos', id: 'blues-scale-solo' },
    },
    {
      id: 'major-scale',
      label: `${key.root} major scale`,
      notes: n,
      tonic: n[0],
      why: 'All seven notes. Use it when you want every chord tone in reach.',
      guide: { category: 'solos', id: 'major-scale-solo' },
    },
  ]
}
