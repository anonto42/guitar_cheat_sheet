import { cn } from '@/lib/utils'

export interface Stat {
  value: string | number
  label: string
}

interface StatGridProps {
  stats: Stat[]
  className?: string
}

/** Row of headline numbers with small captions. 2 columns on phones, 4 from the sm breakpoint. */
export default function StatGrid({ stats, className }: StatGridProps) {
  return (
    <dl className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line2 bg-line2 sm:grid-cols-4', className)}>
      {stats.map(s => (
        <div key={s.label} className="bg-bg2/80 px-4 py-4">
          <dd className="font-display text-2xl font-bold text-cream">{s.value}</dd>
          <dt className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-outline">{s.label}</dt>
        </div>
      ))}
    </dl>
  )
}
