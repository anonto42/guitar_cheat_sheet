'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import EntryCard from '@/components/ui/EntryCard'
import { searchItems } from '@/lib/search'
import SearchBox from './SearchBox'
import { useSearchIndex } from './useSearchIndex'

/** Full results grid for /search?q=... */
export default function SearchResults() {
  const q = useSearchParams().get('q') ?? ''
  const { items, status } = useSearchIndex(true)
  const results = useMemo(() => searchItems(items, q, 60), [items, q])

  return (
    <div>
      <SearchBox className="max-w-xl" />
      <div className="mt-8" aria-live="polite">
        {!q && <p className="text-outline">Type a scale, chord or technique above to start.</p>}
        {q && status === 'loading' && <p className="text-outline">Searching…</p>}
        {q && status === 'error' && <p className="text-outline">Search is unavailable right now. Check your connection and try again.</p>}
        {q && status === 'ready' && (
          <>
            <p className="mb-5 text-sm text-outline">
              {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{q}&rdquo;
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(r => (
                <li key={`${r.category}/${r.id}`}>
                  <EntryCard entry={{ ...r, formula: '' }} showFormula={false} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
