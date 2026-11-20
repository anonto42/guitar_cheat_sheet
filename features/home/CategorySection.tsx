import ArrowLink from '@/components/ui/ArrowLink'
import CardGrid from '@/components/ui/CardGrid'
import EntryCard from '@/components/ui/EntryCard'
import SectionHeading from '@/components/ui/SectionHeading'
import type { CategorySummary } from '@/services/content'
import type { GuitarEntry } from '@/types'

interface CategorySectionProps {
  category: CategorySummary
  entries: GuitarEntry[]
}

/** One category block on the landing page: heading, a few entries and a link to all of them. */
export default function CategorySection({ category, entries }: CategorySectionProps) {
  const headingId = `cat-${category.slug}`
  return (
    <section aria-labelledby={headingId} className="scroll-mt-24">
      <SectionHeading
        id={headingId}
        title={`Guitar ${category.label}`}
        description={category.desc}
        accent={category.a}
        accentTitle
        className="[&_h2]:text-xl sm:[&_h2]:text-2xl [&_p]:text-sm"
        action={<ArrowLink href={`/${category.slug}`}>View all {category.count}</ArrowLink>}
      />
      <CardGrid className="mt-5">
        {entries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
      </CardGrid>
    </section>
  )
}
