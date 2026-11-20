import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Lightbulb } from 'lucide-react'
import { content } from '@/services/content'
import { CATEGORY_CONFIG } from '@/data/categories'
import { FRETBOARDS } from '@/data/fretboards'
import { SITE } from '@/config/site'
import { entryMusic } from '@/lib/music/entryMusic'
import FretboardDiagram from '@/features/fretboard/FretboardDiagram'
import EntryVisual from '@/features/entry/EntryVisual'
import InfoCards from '@/features/entry/InfoCards'
import RelatedList from '@/features/entry/RelatedList'
import Container from '@/components/ui/Container'
import BackLink from '@/components/ui/BackLink'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import JsonLd from '@/components/seo/JsonLd'
import type { CategorySlug } from '@/types'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const entries = await content.listEntries()
  return entries.map(entry => ({ category: entry.category, slug: entry.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const entry = await content.getEntry(category, slug)
  if (!entry) return {}
  const cat = CATEGORY_CONFIG[entry.category as CategorySlug]
  const keyed = cat.keyed !== false
  const title = keyed ? `${entry.title} (Guitar ${cat.label}, All 12 Keys)` : `${entry.title}: Guitar ${cat.label}`
  const description = keyed
    ? `${entry.summary} Formula: ${entry.formula}. Learn the ${entry.title} in every key with fretboard maps and chord shapes. ${entry.usedBy}.`
    : `${entry.summary} ${entry.formula}. ${entry.usedBy}.`
  const url = `${SITE.url}/${entry.category}/${entry.id}`
  const image = `/og?title=${encodeURIComponent(entry.title)}&sub=${encodeURIComponent(`Guitar ${cat.label}`)}&accent=${encodeURIComponent(cat.a)}`
  return {
    title,
    description,
    keywords: [entry.title.toLowerCase(), `${entry.title.toLowerCase()} guitar`, `guitar ${cat.label.toLowerCase()}`, ...entry.tags],
    openGraph: { title, description, url, type: 'article', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    alternates: { canonical: url },
  }
}

export default async function EntryPage({ params }: Props) {
  const { category, slug } = await params
  const entry = await content.getEntry(category, slug)
  if (!entry) notFound()

  const cat = CATEGORY_CONFIG[entry.category as CategorySlug]
  const siblings = await content.listEntries({ category: entry.category })
  const diagrams = FRETBOARDS[entry.id] ?? []
  const music = entryMusic(entry)
  const paragraphs = entry.details.split(/\n\n+/).filter(Boolean)
  const url = `${SITE.url}/${entry.category}/${entry.id}`

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: entry.title,
              description: entry.summary,
              url,
              keywords: entry.tags.join(', '),
              author: { '@type': 'Organization', name: SITE.name },
              publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
                { '@type': 'ListItem', position: 2, name: cat.label, item: `${SITE.url}/${entry.category}` },
                { '@type': 'ListItem', position: 3, name: entry.title, item: url },
              ],
            },
          ],
        }}
      />
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0 space-y-10">
            <header className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Badge accent={cat.a}>{cat.label}</Badge>
                <BackLink href={`/${entry.category}`}>Back to {cat.label}</BackLink>
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl">{entry.title}</h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted">{entry.summary}</p>
              {entry.simple && (
                <div className="border border-line2 bg-surface/80 p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: cat.a }}>In simple words</p>
                  <p className="mt-2 text-base leading-relaxed text-cream">{entry.simple}</p>
                </div>
              )}
            </header>

            <InfoCards entry={entry} cat={cat} compact={music?.kind === 'strum'} />

            {music && <EntryVisual music={music} />}

            {diagrams.length > 0 && (
              <section aria-labelledby="diagrams" className="space-y-3">
                <h2 id="diagrams" className="font-display text-xl font-bold text-cream">On the fretboard</h2>
                <p className="text-sm text-outline">Read left to right. Each dot is a note to play, lines show slides, bends and hammer-ons.</p>
                <div className="grid gap-4 xl:grid-cols-2">
                  {diagrams.map(diagram => (
                    <div key={diagram.id} className="max-w-xl border border-line2 bg-surface/80 p-3">
                      <FretboardDiagram diagram={diagram} accentColor={cat.a} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="about" className="space-y-4">
              <h2 id="about" className="font-display text-xl font-bold text-cream">About the {entry.title}</h2>
              {paragraphs.map((p, i) => <p key={i} className="max-w-3xl text-base leading-relaxed text-muted">{p}</p>)}
              {entry.usedBy && (
                <p className="max-w-3xl text-sm text-outline"><span className="font-bold text-cream">Heard in: </span>{entry.usedBy}</p>
              )}
            </section>

            {entry.tip && (
              <aside className="flex gap-3 border border-line2 bg-surface/80 p-4" aria-label="Tip">
                <Lightbulb size={18} className="mt-0.5 shrink-0" style={{ color: cat.a }} aria-hidden="true" />
                <p className="text-base leading-relaxed text-cream">{entry.tip}</p>
              </aside>
            )}

            {entry.chords.length > 0 && music?.kind !== 'scale' && music?.kind !== 'chord' && music?.kind !== 'progression' && (
              <section aria-labelledby="notes-list" className="space-y-3">
                <h2 id="notes-list" className="font-display text-xl font-bold text-cream">Quick reference</h2>
                <ul className="space-y-1.5">
                  {entry.chords.map((line, i) => <li key={i} className="text-sm text-muted">{line}</li>)}
                </ul>
              </section>
            )}

            <div className="flex flex-wrap gap-3 border-t border-line2 pt-6">
              <Button href="/practice">Practise in the Practice Studio</Button>
              <Button href="/learn" variant="secondary">Follow the learning path</Button>
            </div>

            {entry.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                {entry.tags.map((tag, i) => <li key={i} className="border border-line2 px-2 py-1 text-[0.7rem] text-outline">{tag}</li>)}
              </ul>
            )}
          </article>

          <RelatedList current={entry} entries={siblings} cat={cat} />
        </div>
      </Container>
    </main>
  )
}
