'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/platform'
import { hasOfflineCopy, useOfflineCache } from './useOfflineCache'

interface NetworkInformation {
  saveData?: boolean
  type?: string
  effectiveType?: string
}

/** Cheap check so we never download the whole library on a metered or slow connection. */
function connectionAllowsAutoDownload(): boolean {
  const conn = (navigator as unknown as { connection?: NetworkInformation }).connection
  if (!conn) return true
  if (conn.saveData) return false
  if (conn.type === 'cellular') return false
  return !conn.effectiveType || conn.effectiveType === '4g'
}

/**
 * Registers the service worker in production and, once the page is idle on a good connection,
 * stores the whole library for offline use. Renders nothing.
 */
export default function ServiceWorkerRegister() {
  // Mounted site-wide so the "saved" flag is recorded whichever page the download finishes on.
  useOfflineCache()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator) || isNativeApp()) return

    let cancelled = false
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
        await navigator.serviceWorker.ready
        if (cancelled || !connectionAllowsAutoDownload()) return
        // Refresh the stored copy when it is missing or a new service worker took over.
        if (!hasOfflineCopy() || reg.waiting || reg.installing) reg.active?.postMessage({ type: 'CACHE_ALL' })
      } catch (err) {
        console.warn('Service worker registration failed', err)
      }
    }

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    const run = () => (idle ? idle(register) : setTimeout(register, 2000))
    if (document.readyState === 'complete') run()
    else window.addEventListener('load', run, { once: true })

    return () => { cancelled = true }
  }, [])

  return null
}
