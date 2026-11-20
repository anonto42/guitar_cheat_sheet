import type { Metadata } from 'next'
import { content } from '@/services/content'
import { SITE, SITE_TITLE } from '@/config/site'
import { generateFAQ } from '@/lib/seoGenerators'
import JsonLd from '@/components/seo/JsonLd'
import Container from '@/components/ui/Container'
import HeroSection from '@/features/home/HeroSection'
import CategorySection from '@/features/home/CategorySection'
import AppPromo from '@/features/home/AppPromo'
import HideWhenInstalled from '@/components/layout/HideWhenInstalled'

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  alternates: { canonical: SITE.url },
}

/** How many entries each category shows on the landing page. */
const PREVIEW_COUNT = 3

export default async function HomePage() {
  const [categories, entries] = await Promise.all([content.listCategories(), content.listEntries()])

  return (
    <main>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Course',
            name: 'Guitar Music Theory Reference',
            description: 'A self-study guitar reference covering scales, modes, chords, progressions, techniques, music theory and tunings in all 12 keys.',
            provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            educationalLevel: 'Beginner to Advanced',
          },
          { '@type': 'FAQPage', mainEntity: generateFAQ(entries) },
        ],
      }} />
      <HeroSection topicCount={entries.length} categoryCount={categories.length} />

      <div id="library" className="scroll-mt-20">
        <Container className="space-y-16 py-16 sm:py-20">
          {categories.map(category => (
            <CategorySection
              key={category.slug}
              category={category}
              entries={entries.filter(e => e.category === category.slug).slice(0, PREVIEW_COUNT)}
            />
          ))}
        </Container>
      </div>

      <HideWhenInstalled>
        <AppPromo />
      </HideWhenInstalled>
    </main>
  )
}
