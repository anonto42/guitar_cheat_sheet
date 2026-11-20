'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/platform'

const STORAGE_KEY = 'gcs-offline-version'

function getStoredVersion(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function setStoredVersion(version: string) {
  try { localStorage.setItem(STORAGE_KEY, version) } catch { /* storage may be blocked */ }
}

/** Respect the browser's data saver setting; everything else downloads automatically. */
function dataSaverOn(): boolean {
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
  return conn?.saveData === true
}

/**
 * Makes the whole library available offline with no user action.
 *
 * In production it registers the service worker, then, when the browser is idle, compares the
 * server's content version (/precache.json) with the version stored on this device. If they
 * differ (first visit, new entries, new release) it asks the service worker to store every page.
 * The worker reports completion and the new version is saved. If the device is offline or the
 * download fails, the next page load or the `online` event tries again. Renders nothing.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator) || isNativeApp()) return

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_DONE' && typeof event.data.version === 'string') setStoredVersion(event.data.version)
    }
    navigator.serviceWorker.addEventListener('message', onMessage)

    let cancelled = false
    let registration: ServiceWorkerRegistration | undefined

    const syncOfflineCopy = async () => {
      if (cancelled || !navigator.onLine || dataSaverOn()) return
      try {
        const worker = (registration ?? (await navigator.serviceWorker.ready)).active
        const res = await fetch('/precache.json', { cache: 'no-store' })
        if (!res.ok) return
        const { version } = (await res.json()) as { version: string }
        if (version !== getStoredVersion()) worker?.postMessage({ type: 'CACHE_ALL' })
      } catch {
        /* offline or server unreachable: try again on the next load */
      }
    }

    const start = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
        await navigator.serviceWorker.ready
        await syncOfflineCopy()
      } catch (err) {
        console.warn('Service worker registration failed', err)
      }
    }

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    const run = () => (idle ? idle(start) : setTimeout(start, 2000))
    if (document.readyState === 'complete') run()
    else window.addEventListener('load', run, { once: true })

    window.addEventListener('online', syncOfflineCopy)

    return () => {
      cancelled = true
      navigator.serviceWorker.removeEventListener('message', onMessage)
      window.removeEventListener('online', syncOfflineCopy)
    }
  }, [])

  return null
}
