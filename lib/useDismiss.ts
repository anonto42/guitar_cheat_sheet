'use client'

import { useEffect, type RefObject } from 'react'

/** Calls `onDismiss` on Escape or on a pointer press outside `ref`. Active only while `enabled`. */
export function useDismiss(ref: RefObject<HTMLElement | null>, enabled: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) onDismiss() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [ref, enabled, onDismiss])
}
