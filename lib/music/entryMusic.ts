import type { GuitarEntry } from '@/types'
import { CHORD_TYPE_FOR_ENTRY } from './chordTypes'
import { progressionForEntry } from './progressions'
import { SCALE_CATALOG, normaliseRoot } from './scales'
import { TUNINGS } from './tunings'

/** Which interactive view an entry page shows, as plain data that can be passed to a client component. */
export type EntryMusic =
  | { kind: 'scale'; entryId: string; title: string; defaultRoot: string }
  | { kind: 'chord'; typeId: string; defaultRoot: string; arpeggio: boolean }
  | { kind: 'slash'; defaultRoot: string }
  | { kind: 'strum'; patternId: string }
  | { kind: 'progression'; progressionId: string; defaultRoot: string }
  | { kind: 'theory'; entryId: string }
  | { kind: 'tuning'; tuningId: string }
  | { kind: 'rhythm' }

const THEORY_VISUALS = new Set([
  'circle-of-fifths', 'intervals', 'caged-system', 'relative-keys', 'transposing', 'nashville-number',
  'chord-inversions', 'chord-construction', 'voice-leading', 'modes-explained', 'diatonic-harmony',
  'secondary-dominants', 'chord-types',
])

function exampleRoot(entry: GuitarEntry, quality: 'major' | 'minor', fallback: string): string {
  const match = /^([A-G](?:♯|♭|#|b(?![a-z])))?/.exec(entry.example?.root ?? '')
  const plain = /^([A-G])(?![a-z])/.exec(entry.example?.root ?? '')
  const name = match?.[1] ?? plain?.[1]
  return name ? normaliseRoot(name, quality) : fallback
}

export function entryMusic(entry: GuitarEntry): EntryMusic | null {
  const scale = SCALE_CATALOG[entry.id]
  if (scale) return { kind: 'scale', entryId: entry.id, title: entry.title, defaultRoot: exampleRoot(entry, scale.quality, scale.quality === 'minor' ? 'A' : 'C') }

  const chordType = CHORD_TYPE_FOR_ENTRY[entry.id]
  if (chordType) return { kind: 'chord', typeId: chordType, defaultRoot: exampleRoot(entry, 'major', 'C'), arpeggio: entry.id.endsWith('arpeggio') }

  if (entry.id === 'slash-chords') return { kind: 'slash', defaultRoot: 'C' }
  if (entry.category === 'strumming') return { kind: 'strum', patternId: entry.id }

  const progression = progressionForEntry(entry.id)
  if (progression) return { kind: 'progression', progressionId: progression.id, defaultRoot: progression.mode === 'minor' ? 'A' : 'C' }

  if (entry.category === 'tunings' && TUNINGS.some(t => t.id === entry.id)) return { kind: 'tuning', tuningId: entry.id }
  if (entry.id === 'rhythm-for-solos' || entry.id === 'note-timing-solo') return { kind: 'rhythm' }
  if (entry.category === 'theory' && THEORY_VISUALS.has(entry.id)) return { kind: 'theory', entryId: entry.id }
  return null
}
