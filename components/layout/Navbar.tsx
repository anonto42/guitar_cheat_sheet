'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download, Menu, Search, X } from 'lucide-react'
import { PRIMARY_LINKS } from '@/config/navigation'
import { cn } from '@/lib/utils'
import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'
import SearchBox from '@/features/search/SearchBox'
import HideWhenInstalled from './HideWhenInstalled'
import LibraryMenu from './LibraryMenu'
import MobileMenu from './MobileMenu'
import { OPEN_MENU_EVENT } from './AppTabBar'

/**
 * Site navbar.
 *  - Desktop (lg+): logo, Library dropdown, links, inline search, app button.
 *  - Tablet/phone: menu button, logo, search toggle that expands to a full-width bar.
 */
export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // The app's bottom tab bar opens the same menu.
  useEffect(() => {
    const open = () => setMenuOpen(true)
    window.addEventListener(OPEN_MENU_EVENT, open)
    return () => window.removeEventListener(OPEN_MENU_EVENT, open)
  }, [])

  return (
    <header className="sticky top-0 z-[100] bg-bg2/90 pt-[var(--safe-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-nav max-w-7xl items-center gap-2 px-3 sm:px-6 lg:gap-3 lg:px-8 xl:gap-6">
        {/* Mobile: menu button */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-outline hover:bg-white/5 hover:text-cream app:hidden lg:hidden"
        >
          <Menu size={20} />
        </button>

        <Logo compact className="min-w-0 flex-1 lg:flex-none" />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          <LibraryMenu />
          {PRIMARY_LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-[var(--control-h)] items-center px-2.5 text-sm font-semibold transition-colors xl:px-3',
                  link.wideOnly && 'hidden xl:flex',
                  active ? 'text-ember-l' : 'text-outline hover:text-cream',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop search */}
        <div className="hidden flex-1 lg:block">
          <SearchBox className="ml-auto max-w-md" />
        </div>

        <HideWhenInstalled>
          <Button href="/download" size="sm" aria-label="Get the app" className="hidden h-[var(--control-h)] shrink-0 border border-ember lg:inline-flex">
            <Download size={15} aria-hidden="true" />
            <span className="hidden xl:inline">Get the app</span>
          </Button>
        </HideWhenInstalled>

        {/* Mobile: search toggle */}
        <button
          type="button"
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(o => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-outline hover:bg-white/5 hover:text-cream lg:hidden"
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Mobile: expanded search bar */}
      {searchOpen && (
        <div className="border-t border-line px-3 pb-3 pt-2 sm:px-6 lg:hidden">
          <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  )
}
