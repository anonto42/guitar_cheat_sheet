'use client'

import { useLayoutEffect } from 'react'

/**
 * On a hard refresh, browsers restore the previous scroll offset before late layout changes
 * (web fonts, images) settle, which can leave the page stranded far down. Start every
 * reload at the top unless the URL points at a section. Renders nothing.
 */
export default function ScrollToTopOnReload() {
  useLayoutEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type !== 'reload' || window.location.hash) return
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    // Restore the default so back/forward navigation keeps working normally.
    const restore = () => { history.scrollRestoration = previous }
    window.addEventListener('load', restore, { once: true })
    return () => window.removeEventListener('load', restore)
  }, [])

  return null
}
