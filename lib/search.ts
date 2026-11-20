import type { SearchIndexItem } from '@/services/content/types'

/** Lowercase and fold musical accidentals so "Bb" matches "B♭" and "F#" matches "F♯". */
export function normalize(value: string): string {
  return value.replace(/♭/g, 'b').replace(/♯/g, '#').toLowerCase().trim()
}

function score(item: SearchIndexItem, terms: string[]): number {
  const title = normalize(item.title)
  const summary = normalize(item.summary)
  const tags = item.tags.map(normalize)
  let total = 0
  for (const term of terms) {
    let best = 0
    if (title === term) best = 100
    else if (title.startsWith(term)) best = 80
    else if (title.includes(term)) best = 60
    else if (tags.some(t => t === term)) best = 45
    else if (tags.some(t => t.includes(term))) best = 30
    else if (summary.includes(term)) best = 15
    if (best === 0) return 0 // every term must match somewhere
    total += best
  }
  return total
}

/** Rank index items against a free-text query. Pure and synchronous. */
export function searchItems(items: SearchIndexItem[], query: string, limit = 8): SearchIndexItem[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return items
    .map(item => ({ item, s: score(item, terms) }))
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(r => r.item)
}
