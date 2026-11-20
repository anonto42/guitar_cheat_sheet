'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'gcs-offline-version'

export type OfflineStatus = 'unsupported' | 'idle' | 'caching' | 'ready' | 'error'

export interface OfflineCacheState {
  status: OfflineStatus
  progress: number // 0 to 1
  start: () => void
}

function readStored(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function writeStored(version: string) {
  try { localStorage.setItem(STORAGE_KEY, version) } catch { /* storage may be blocked */ }
}

/** True once a full offline copy exists for this browser (any version). */
export function hasOfflineCopy(): boolean {
  return readStored() !== null
}

const subscribe = () => () => {}
const supportsServiceWorker = () => 'serviceWorker' in navigator

/** Asks the service worker to store every page, and reports progress. */
export function useOfflineCache(): OfflineCacheState {
  const supported = useSyncExternalStore(subscribe, supportsServiceWorker, () => true)
  const stored = useSyncExternalStore(subscribe, hasOfflineCopy, () => false)
  const [live, setLive] = useState<{ status: OfflineStatus; progress: number } | null>(null)

  useEffect(() => {
    if (!supported) return
    const onMessage = (event: MessageEvent) => {
      const msg = event.data
      if (msg?.type === 'CACHE_PROGRESS') {
        setLive({ status: 'caching', progress: msg.done / msg.total })
      } else if (msg?.type === 'CACHE_DONE') {
        writeStored(msg.version)
        setLive({ status: 'ready', progress: 1 })
      } else if (msg?.type === 'CACHE_ERROR') {
        setLive({ status: 'error', progress: 0 })
      }
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [supported])

  const start = useCallback(() => {
    navigator.serviceWorker?.ready.then(reg => {
      setLive({ status: 'caching', progress: 0 })
      reg.active?.postMessage({ type: 'CACHE_ALL' })
    })
  }, [])

  if (!supported) return { status: 'unsupported', progress: 0, start }
  if (live) return { ...live, start }
  return { status: stored ? 'ready' : 'idle', progress: stored ? 1 : 0, start }
}
