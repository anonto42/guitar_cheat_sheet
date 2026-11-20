import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import CardGrid from '@/components/ui/CardGrid'
import NoteChips from '@/components/music/NoteChips'
import { MAJOR_KEYS, signatureLabel } from '@/lib/music/keys'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'All 12 Guitar Keys: Scales, Modes, Chords and Practice',
  description: 'Pick any of the 12 major keys and see its scale, seven modes, triads, chord types, strumming patterns, progressions and solo scales in one place.',
  alternates: { canonical: `${SITE.url}/keys` },
}

export default function KeysPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Step 2 of the learning path"
          title="Pick a key"
          description="Each key page walks through the whole flow for one key: the scale, its seven modes, its triads, every chord type, strumming, progressions to practise and the scales to solo with. Start with C major, which has no sharps or flats."
        />
        <CardGrid className="mt-10">
          {MAJOR_KEYS.map(key => (
            <Link key={key.slug} href={`/keys/${key.slug}`} className="block h-full border border-line2 bg-surface/80 p-5 transition-colors hover:bg-card">
              <p className="font-display text-2xl font-bold text-cream">{key.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ember">{signatureLabel(key)}</p>
              <NoteChips notes={key.notes} tonic={key.root} className="mt-4" />
            </Link>
          ))}
        </CardGrid>
      </Container>
    </main>
  )
}
