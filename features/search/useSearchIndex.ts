'use client'

import { useEffect, useState } from 'react'
import type { SearchIndexItem } from '@/services/content/types'

/** Where the index is served from. Point this at an API route later without touching callers. */
export const SEARCH_INDEX_URL = '/search-index.json'

let cache: Promise<SearchIndexItem[]> | null = null

/** Fetches the index once per page load. The service worker keeps it available offline. */
export function loadSearchIndex(): Promise<SearchIndexItem[]> {
  cache ??= fetch(SEARCH_INDEX_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Search index request failed (${res.status})`)
      return res.json() as Promise<SearchIndexItem[]>
    })
    .catch(err => {
      cache = null // allow a retry on the next call
      throw err
    })
  return cache
}

interface SearchIndexState {
  items: SearchIndexItem[]
  status: 'idle' | 'loading' | 'ready' | 'error'
}

/** Lazy-loads the index the first time `enabled` becomes true (e.g. when the input is focused). */
export function useSearchIndex(enabled: boolean): SearchIndexState {
  const [state, setState] = useState<SearchIndexState>({ items: [], status: 'idle' })

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    loadSearchIndex()
      .then(items => !cancelled && setState({ items, status: 'ready' }))
      .catch(() => !cancelled && setState({ items: [], status: 'error' }))
    return () => { cancelled = true }
  }, [enabled])

  // Requested but not answered yet.
  if (enabled && state.status === 'idle') return { items: [], status: 'loading' }
  return state
}
