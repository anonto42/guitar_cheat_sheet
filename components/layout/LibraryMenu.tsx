'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { LIBRARY_LINKS } from '@/config/navigation'
import { useDismiss } from '@/lib/useDismiss'
import { cn } from '@/lib/utils'

/** Desktop "Library" dropdown listing every category. Opens on click or keyboard; closes on Escape or outside click. */
export default function LibraryMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const inLibrary = LIBRARY_LINKS.some(l => pathname === l.href || pathname.startsWith(`${l.href}/`))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex h-[var(--control-h)] items-center gap-1.5 px-3 text-sm font-semibold transition-colors',
          open || inLibrary ? 'text-ember-l' : 'text-outline hover:text-cream',
        )}
      >
        Library
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[34rem] rounded-xl border border-line2 bg-bg3 p-2 shadow-2xl shadow-black/60 animate-fade-in">
          <ul className="grid grid-cols-2 gap-1">
            {LIBRARY_LINKS.map(link => (
              <li key={link.slug}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="group flex rounded-lg p-3 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-cream group-hover:text-ember-l">{link.label}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-outline">{link.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
