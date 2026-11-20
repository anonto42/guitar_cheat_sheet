'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type RevealVariant = 'up' | 'left' | 'right' | 'scale'

interface ScrollRevealProps {
  children: ReactNode
  variant?: RevealVariant
  /** Seconds to wait after the element enters view. Use small steps (0.08) to stagger siblings. */
  delay?: number
  as?: ElementType
  className?: string
}

/**
 * Animates its content in the first time it scrolls into view.
 *
 * The server renders it fully visible, so the page works without JavaScript. After hydration,
 * elements that are below the fold are hidden and then revealed by an IntersectionObserver;
 * elements already on screen are left alone, so nothing flashes. Skipped entirely for people
 * who prefer reduced motion. State lives in a data attribute (not React state) to avoid
 * re-rendering. Styles are in app/globals.css (`.sr`).
 */
export default function ScrollReveal({ children, variant = 'up', delay = 0, as, className }: ScrollRevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight) return // already visible: leave as is

    el.dataset.sr = 'hidden'
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          el.dataset.sr = 'shown'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-variant={variant} className={cn('sr', className)} style={{ '--d': `${delay}s` } as CSSProperties}>
      {children}
    </Tag>
  )
}
