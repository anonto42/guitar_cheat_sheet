'use client'

import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'gcs-learn-done'
const CHANGE_EVENT = 'gcs-learn-progress'

function readRaw(): string {
  try { return localStorage.getItem(STORAGE_KEY) ?? '[]' } catch { return '[]' }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

/** Which learning steps the visitor has marked done. Stored in this browser only. */
export function useLearnProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '[]')
  const done = parse(raw)

  const toggle = useCallback((slug: string) => {
    const current = parse(readRaw())
    const next = current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug]
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage may be blocked */ }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return { done, toggle }
}
