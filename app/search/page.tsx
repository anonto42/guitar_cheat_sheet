import type { Metadata } from 'next'
import { Suspense } from 'react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SearchResults from '@/features/search/SearchResults'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every guitar scale, chord, mode, progression, technique and tuning.',
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <main>
      <Container size="lg" className="py-12 sm:py-16">
        <SectionHeading as="h1" eyebrow="Search" title="Find anything in the reference" className="mb-8" />
        <Suspense fallback={null}>
          <SearchResults />
        </Suspense>
      </Container>
    </main>
  )
}
