import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/** Compact "back" action for page headers. */
export default function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line2 bg-surface/70 px-4 text-xs font-semibold text-outline backdrop-blur transition-colors hover:border-line3 hover:text-cream',
        className,
      )}
    >
      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
      {children}
    </Link>
  )
}
