'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { readHistory, writeHistory } from './history'

/**
 * Records each page the visitor opens in this tab, so BackLink can say "Back to Major Scale"
 * and return to exactly that page. Query strings (for example ?key=g) are kept. Renders nothing.
 */
export default function HistoryTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Wait a moment so the new page's <title> is in place.
    const id = window.setTimeout(() => {
      const path = window.location.pathname + window.location.search
      const pages = readHistory()
      const last = pages[pages.length - 1]
      if (last?.path.split('?')[0] === window.location.pathname) {
        pages[pages.length - 1] = { path, title: document.title }
      } else if (pages.length >= 2 && pages[pages.length - 2].path.split('?')[0] === window.location.pathname) {
        pages.pop() // the visitor went back
      } else {
        pages.push({ path, title: document.title })
      }
      writeHistory(pages)
    }, 150)
    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
