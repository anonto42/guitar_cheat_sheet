'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Thin ember bar at the top of the screen. It starts when an internal link is clicked and
 * completes when the new route has rendered, so slow connections never feel frozen.
 * Updates the DOM directly through refs to avoid re-rendering the layout.
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const bar = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const value = useRef(0)

  const paint = (width: number, opacity: number) => {
    if (!bar.current) return
    bar.current.style.width = `${width}%`
    bar.current.style.opacity = String(opacity)
  }

  const start = () => {
    if (timer.current) return
    if (hideTimer.current) clearTimeout(hideTimer.current)
    value.current = 8
    paint(value.current, 1)
    // Ease towards 90% and wait there until the route is ready.
    timer.current = setInterval(() => {
      value.current += (90 - value.current) * 0.08
      paint(value.current, 1)
    }, 120)
  }

  const finish = () => {
    if (!timer.current) return
    clearInterval(timer.current)
    timer.current = null
    paint(100, 1)
    hideTimer.current = setTimeout(() => {
      if (bar.current) bar.current.style.transition = 'opacity .3s'
      paint(100, 0)
      setTimeout(() => {
        if (bar.current) bar.current.style.transition = 'width .2s ease-out, opacity .3s'
        paint(0, 0)
      }, 320)
    }, 180)
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.search === location.search) return
      start()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { finish() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]">
      <div
        ref={bar}
        className="h-full w-0 bg-gradient-to-r from-ember via-amber to-ember opacity-0 shadow-[0_0_10px_rgba(255,107,0,.8)]"
        style={{ transition: 'width .2s ease-out, opacity .3s' }}
      />
    </div>
  )
}
