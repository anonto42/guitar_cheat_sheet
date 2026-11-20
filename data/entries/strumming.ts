import type { GuitarEntry } from '@/types'
import { STRUM_PATTERNS } from '@/data/strumPatterns'

/** Strumming reference entries, generated from the pattern definitions so there is one source of truth. */
export const strumming: GuitarEntry[] = STRUM_PATTERNS.map(p => ({
  id: p.id,
  category: 'strumming',
  title: p.name,
  tags: p.tags,
  summary: p.summary,
  formula: p.steps.map(s => (s === '-' ? '·' : s)).join(' '),
  degrees: `${p.time} | Count: ${p.counts.join(' ')} | D down, U up, x muted chop, M palm mute, · rest`,
  example: { root: p.time, notes: p.counts.map((c, i) => `${c}: ${p.steps[i] === '-' ? 'rest' : p.steps[i]}`) },
  allKeys: [],
  chords: [],
  details: p.details,
  usedBy: p.usedBy,
  tip: p.tip,
}))
