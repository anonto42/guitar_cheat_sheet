'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/** Slim notice shown while the device has no connection. */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (!offline) return null
  return (
    <div role="status" className="flex items-center justify-center gap-2 bg-ember-dim px-4 py-2 text-xs font-semibold text-ember-l">
      <WifiOff size={14} aria-hidden="true" />
      You are offline. Pages saved on this device still work.
    </div>
  )
}
