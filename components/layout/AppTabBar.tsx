'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Home, LayoutGrid, Music, Gauge } from 'lucide-react'
import { LIBRARY_LINKS } from '@/config/navigation'
import { cn } from '@/lib/utils'

/** Asks the navbar to open the library menu. */
export const OPEN_MENU_EVENT = 'gcs-open-menu'

const TABS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Learn', href: '/learn', icon: GraduationCap },
  { label: 'Practice', href: '/practice', icon: Music },
  { label: 'Tuner', href: '/tuner', icon: Gauge },
]

const LIBRARY_PATHS = [...LIBRARY_LINKS.map(l => l.href), '/keys', '/search']

/**
 * Bottom tab bar, shown only when the site runs as an app on a phone or tablet (see the `app:`
 * variant). Apps keep their main sections one tap away at the bottom; the website uses the menu.
 */
export default function AppTabBar() {
  const pathname = usePathname()
  const inLibrary = LIBRARY_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))

  const item = 'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[0.65rem] font-semibold transition-colors'
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-[90] hidden border-t border-line2 bg-bg2/95 pb-[var(--safe-bottom)] backdrop-blur-xl app:max-lg:block"
    >
      <ul className="flex h-[var(--tab-h)]">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex min-w-0 flex-1">
              <Link href={href} aria-current={active ? 'page' : undefined} className={cn(item, active ? 'text-ember' : 'text-outline')}>
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
        <li className="flex min-w-0 flex-1">
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))} className={cn(item, inLibrary ? 'text-ember' : 'text-outline')}>
            <LayoutGrid size={22} strokeWidth={inLibrary ? 2.4 : 1.8} aria-hidden="true" />
            Library
          </button>
        </li>
      </ul>
    </nav>
  )
}
