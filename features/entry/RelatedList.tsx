import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CategoryConfig, GuitarEntry } from '@/types'

interface RelatedListProps {
  current: GuitarEntry
  entries: GuitarEntry[]
  cat: CategoryConfig
}

/** Sidebar list of every entry in the category, with the current one marked. */
export default function RelatedList({ current, entries, cat }: RelatedListProps) {
  return (
    <nav aria-label={`More ${cat.label}`} className="border border-line2 bg-surface/80 lg:sticky lg:top-24">
      <p className="border-b border-line2 px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: cat.a }}>
        More {cat.label}
      </p>
      <ol className="max-h-[70vh] overflow-y-auto">
        {entries.map(entry => {
          const active = entry.id === current.id
          return (
            <li key={entry.id}>
              <Link
                href={`/${entry.category}/${entry.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn('block border-b border-line px-4 py-2.5 text-sm transition-colors', active ? 'text-bg2' : 'text-muted hover:bg-white/[0.04] hover:text-cream')}
                style={active ? { background: cat.a } : undefined}
              >
                {entry.title}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
