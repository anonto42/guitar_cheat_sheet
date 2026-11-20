import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SITE } from '@/config/site'
import LogoMark from './LogoMark'

interface LogoProps {
  /** Hide the wordmark below this breakpoint to save space on phones. */
  compact?: boolean
  href?: string | null
  className?: string
  onClick?: () => void
}

/** Mark + wordmark. Renders a link to the home page unless `href` is null. */
export default function Logo({ compact = false, href = '/', className, onClick }: LogoProps) {
  const inner = (
    <>
      <LogoMark size={32} className="shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-bold tracking-wide text-cream">Guitar Cheat Sheet</span>
        <span className={cn('mt-1 text-[0.55rem] font-bold uppercase tracking-[0.22em] text-ember', compact && 'hidden sm:block')}>
          Free reference
        </span>
      </span>
    </>
  )
  const classes = cn('inline-flex items-center gap-2.5', className)

  if (href === null) return <span className={classes}>{inner}</span>
  return (
    <Link href={href} onClick={onClick} className={classes} aria-label={`${SITE.name} home`}>
      {inner}
    </Link>
  )
}
