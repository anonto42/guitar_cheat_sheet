'use client'

import { useCallback, useSyncExternalStore } from 'react'

const EVENT = 'gcs-url-param'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

/**
 * Read and write one query parameter without a server round trip. The page stays fully static
 * (the server renders the default value), so this works offline and in the native app too.
 */
export function useUrlParam(name: string, fallback: string): [string, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name) ?? fallback,
    () => fallback,
  )
  const set = useCallback((next: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(name, next)
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(EVENT))
  }, [name])
  return [value, set]
}
