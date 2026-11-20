import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArrowLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/** Text link with a trailing arrow that nudges on hover ("View all", "Read more"). */
export default function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-1.5 text-sm font-semibold text-outline transition-colors hover:text-cream', className)}
    >
      {children}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  )
}
