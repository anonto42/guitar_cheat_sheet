'use client'

import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Download, X } from 'lucide-react'
import { LIBRARY_LINKS, PRIMARY_LINKS } from '@/config/navigation'

const MORE_LINKS = [
  ...PRIMARY_LINKS,
  { label: 'All 12 keys', href: '/keys' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
]
import Logo from '@/components/brand/Logo'
import HideWhenInstalled from './HideWhenInstalled'

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Slide-in drawer for phones. Radix Dialog supplies focus trapping, Escape handling and scroll lock. */
export default function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const close = () => onOpenChange(false)
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm animate-overlay-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-[120] flex w-[85%] max-w-sm flex-col border-r border-line2 bg-bg2 pt-[var(--safe-top)] animate-slide-in-left"
        >
          <div className="flex h-nav shrink-0 items-center justify-between border-b border-line px-4">
            <Dialog.Title asChild><span><Logo onClick={close} /></span></Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-md text-outline hover:bg-white/5 hover:text-cream">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-4">
            <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-outline/70">Library</p>
            <ul>
              {LIBRARY_LINKS.map(link => (
                <li key={link.slug}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex min-h-12 items-center rounded-lg px-3 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="px-3 pb-2 pt-6 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-outline/70">More</p>
            <ul>
              {MORE_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className="flex min-h-12 items-center rounded-lg px-3 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-white/5">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <HideWhenInstalled>
          <div className="shrink-0 border-t border-line p-4 pb-[calc(1rem+var(--safe-bottom))]">
            <Link
              href="/download"
              onClick={close}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-ember text-sm font-bold text-bg2 hover:bg-ember-l"
            >
              <Download size={16} aria-hidden="true" />
              Get the app
            </Link>
          </div>
          </HideWhenInstalled>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
