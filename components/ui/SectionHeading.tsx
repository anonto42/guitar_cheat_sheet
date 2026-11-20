import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  /** Accent colour for the eyebrow. */
  accent?: string
  /** Colour the title itself with the accent. */
  accentTitle?: boolean
  id?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  action?: React.ReactNode
  className?: string
}

/** Eyebrow + title + description block used at the top of every page section. */
export default function SectionHeading({
  eyebrow, title, description, accent, accentTitle, id, align = 'left', as: Tag = 'h2', action, className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ember" style={accent ? { color: accent } : undefined}>
            {eyebrow}
          </p>
        )}
        <Tag id={id} className="font-display text-2xl font-bold leading-tight tracking-tight text-cream sm:text-3xl" style={accentTitle && accent ? { color: accent } : undefined}>{title}</Tag>
        {description && <p className="mt-2 text-sm leading-relaxed text-outline sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
