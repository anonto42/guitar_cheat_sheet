import { cn } from '@/lib/utils'
import Container from './Container'

interface CtaPanelProps {
  id: string
  title: string
  description: string
  /** Large decorative element placed behind the text, top right. */
  decoration?: React.ReactNode
  /** Extra content between the description and the action (lists, badges). */
  children?: React.ReactNode
  /** Buttons or links. */
  action: React.ReactNode
  className?: string
}

/** Full-width highlighted call to action block. */
export default function CtaPanel({ id, title, description, decoration, children, action, className }: CtaPanelProps) {
  return (
    <section aria-labelledby={id}>
      <Container>
        <div className={cn('relative overflow-hidden rounded-2xl border border-ember/25 bg-gradient-to-br from-[#1f140b] via-bg2 to-bg2 p-8 sm:p-12', className)}>
          {decoration}
          <div className="relative max-w-xl">
            <h2 id={id} className="font-display text-2xl font-bold text-cream sm:text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
            {children && <div className="mt-5">{children}</div>}
            <div className="mt-7">{action}</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
