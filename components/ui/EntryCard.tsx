import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import AccentSweep from './AccentSweep'
import { CATEGORY_CONFIG } from '@/data/categories'
import type { GuitarEntry } from '@/types'

interface EntryCardProps {
  entry: Pick<GuitarEntry, 'id' | 'category' | 'title' | 'summary' | 'formula'>
  /** Show the formula line. */
  showFormula?: boolean
}

/** Linked teaser for one reference entry. Accent colour comes from the entry's category. */
export default function EntryCard({ entry, showFormula = true }: EntryCardProps) {
  const accent = CATEGORY_CONFIG[entry.category].a
  return (
    <Link
      href={`/${entry.category}/${entry.id}`}
      className="sweep-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-line2 bg-surface p-5 transition-all hover:-translate-y-0.5 hover:bg-card"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <AccentSweep />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-cream">{entry.title}</h3>
        <ArrowUpRight size={16} className="mt-1 shrink-0 text-outline transition-colors group-hover:text-[color:var(--accent)]" aria-hidden="true" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-outline">{entry.summary}</p>
      {showFormula && entry.formula && (
        <p className="mt-auto pt-4 text-xs font-semibold tracking-wide text-[color:var(--accent)] opacity-80">{entry.formula}</p>
      )}
    </Link>
  )
}
