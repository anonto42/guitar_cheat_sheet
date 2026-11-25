'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HISTORY_EVENT, readHistory, shortTitle } from '@/features/navigation/history'

interface BackLinkProps {
  /** Where to go when there is no previous page in this tab (for example a direct visit). */
  href: string
  /** Label used with `href`. */
  children: React.ReactNode
  className?: string
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(HISTORY_EVENT, onChange)
  return () => window.removeEventListener(HISTORY_EVENT, onChange)
}

function previousPage(): string {
  const pages = readHistory()
  const here = window.location.pathname
  const current = pages.length && pages[pages.length - 1].path.split('?')[0] === here ? pages.length - 1 : pages.length
  const previous = pages[current - 1]
  return previous ? JSON.stringify(previous) : ''
}

/**
 * "Back" that goes to the page the visitor actually came from and names it. Falls back to a
 * sensible parent page when the visitor landed here directly.
 */
export default function BackLink({ href, children, className }: BackLinkProps) {
  const router = useRouter()
  const raw = useSyncExternalStore(subscribe, previousPage, () => '')
  const previous = raw ? (JSON.parse(raw) as { path: string; title: string }) : null

  const classes = cn(
    'group inline-flex h-[var(--control-h)] min-w-0 max-w-[60%] items-center sm:max-w-[16rem] gap-2 border border-line2 bg-surface/70 px-4 text-xs font-semibold text-outline backdrop-blur transition-colors hover:border-line3 hover:text-cream',
    className,
  )
  const icon = <ArrowLeft size={14} className="shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />

  if (previous) {
    return (
      <button type="button" onClick={() => router.back()} className={classes}>
        {icon}
        <span className="truncate">Back to {shortTitle(previous.title)}</span>
      </button>
    )
  }
  return (
    <Link href={href} className={classes}>
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  )
}
