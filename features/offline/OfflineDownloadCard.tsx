'use client'

import { CheckCircle2, CloudDownload, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useOfflineCache } from './useOfflineCache'

/** Lets the user store every page on this device with one tap and shows progress. */
export default function OfflineDownloadCard() {
  const { status, progress, start } = useOfflineCache()
  const percent = Math.round(progress * 100)

  return (
    <div className="rounded-xl border border-line2 bg-surface p-5">
      <div className="flex items-start gap-3">
        <CloudDownload size={20} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-cream">Offline library</h3>
          <p className="mt-1 text-sm leading-relaxed text-outline">
            Save every scale, chord, mode and technique on this device. No signal needed afterwards.
          </p>

          {status === 'unsupported' && (
            <p className="mt-3 text-xs text-outline">This browser does not support offline storage.</p>
          )}

          {status === 'caching' && (
            <div className="mt-4" role="status" aria-live="polite">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-ember transition-[width] duration-200" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs text-outline">
                <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Saving {percent}%
              </p>
            </div>
          )}

          {status === 'ready' && (
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-theory">
              <CheckCircle2 size={16} aria-hidden="true" /> Saved. The whole library works offline.
            </p>
          )}

          {status === 'error' && (
            <p className="mt-3 text-xs text-tunings">Could not save the library. Check your connection and try again.</p>
          )}

          {(status === 'idle' || status === 'error' || status === 'ready') && (
            <Button size="sm" variant={status === 'ready' ? 'secondary' : 'primary'} className="mt-4" onClick={start}>
              {status === 'ready' ? 'Refresh offline copy' : 'Save for offline'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
