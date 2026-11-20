import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { content } from '@/services/content'
import { SITE } from '@/config/site'
import { MAJOR_KEYS, getMajorKey, modesOfKey, signatureLabel, soloScales, triadsOfKey } from '@/lib/music/keys'
import { CHORD_TYPES, buildChord, buildSlashChords, getChordType } from '@/lib/music/chordTypes'
import { PRACTICE_PROGRESSIONS, progressionChords } from '@/lib/music/progressions'
import Container from '@/components/ui/Container'
import PageSection from '@/components/ui/PageSection'
import ChipNav from '@/components/ui/ChipNav'
import SimpleTable from '@/components/ui/SimpleTable'
import CardGrid from '@/components/ui/CardGrid'
import EntryCard from '@/components/ui/EntryCard'
import ArrowLink from '@/components/ui/ArrowLink'
import BackLink from '@/components/ui/BackLink'
import Button from '@/components/ui/Button'
import JsonLd from '@/components/seo/JsonLd'
import NoteChips from '@/components/music/NoteChips'
import NoteMap from '@/components/music/NoteMap'
import ChordCard from '@/components/music/ChordCard'

interface Props {
  params: Promise<{ key: string }>
}

export function generateStaticParams() {
  return MAJOR_KEYS.map(k => ({ key: k.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key: slug } = await params
  const key = getMajorKey(slug)
  if (!key) return {}
  const title = `${key.name} on Guitar: Scale, Modes, Chords and Practice`
  const description = `Everything in ${key.name}: the scale (${key.notes.join(' ')}), its seven modes, triads, chord types, strumming patterns, progressions to practise and the scales to solo with.`
  return { title, description, alternates: { canonical: `${SITE.url}/keys/${key.slug}` }, openGraph: { title, description, url: `${SITE.url}/keys/${key.slug}` } }
}

const SECTIONS = [
  { href: '#scale', label: 'Scale' },
  { href: '#modes', label: 'Modes' },
  { href: '#triads', label: 'Triads' },
  { href: '#chord-types', label: 'Chord types' },
  { href: '#strumming', label: 'Strumming' },
  { href: '#practice', label: 'Practice' },
  { href: '#solo', label: 'Solo' },
]

const entryHref = (category: string, id: string) => `/${category}/${id}`

export default async function KeyPage({ params }: Props) {
  const { key: slug } = await params
  const key = getMajorKey(slug)
  if (!key) notFound()

  const index = MAJOR_KEYS.indexOf(key)
  const previous = MAJOR_KEYS[(index + MAJOR_KEYS.length - 1) % MAJOR_KEYS.length]
  const next = MAJOR_KEYS[(index + 1) % MAJOR_KEYS.length]

  const modes = modesOfKey(key)
  const triads = triadsOfKey(key)
  const solos = soloScales(key)
  const strumEntries = (await content.listEntries({ category: 'strumming' })).slice(0, 3)
  const relativeMinor = key.notes[5]

  const chordTypeCards = CHORD_TYPES.map(type => ({ type, chord: buildChord(key.root, type) }))
  const slashChords = [...buildSlashChords(key.root, getChordType('major')), ...buildSlashChords(key.root, getChordType('minor'))]

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${key.name} on guitar: scale, modes, chords and practice`,
          description: `The ${key.name} scale (${key.notes.join(', ')}), its modes, triads, chord types, progressions and solo scales.`,
          url: `${SITE.url}/keys/${key.slug}`,
          author: { '@type': 'Organization', name: SITE.name },
          publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        }}
      />
      <Container className="space-y-16 py-12 sm:py-16">
        <header>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ember">Key of {key.root}</p>
            <BackLink href="/keys">All keys</BackLink>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">{key.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {signatureLabel(key)}. The relative minor is {relativeMinor} minor, which uses the same seven notes.
            Work down this page from top to bottom: scale, modes, triads, chord types, strumming, practice, then solo.
          </p>
          <ChipNav items={SECTIONS} label="On this page" />
        </header>

        <PageSection id="scale" eyebrow="1. Scale" title={`The ${key.name} scale`} description="Whole and half steps in the pattern W W H W W W H. Every position of these notes on the neck is below, with the home note highlighted.">
          <NoteChips notes={key.notes} tonic={key.root} />
          <NoteMap className="mt-6" notes={key.notes} tonic={key.root} label={`${key.name} scale notes on the fretboard`} />
        </PageSection>

        <PageSection id="modes" eyebrow="2. Modes" title={`The seven modes of ${key.name}`} description={`Same seven notes, started from each degree. Play ${key.notes.join(' ')} but make each starting note feel like home.`}>
          <SimpleTable
            head={['Mode', 'Starts on', 'Notes', 'Feel']}
            rows={modes.map(mode => [
              <Link key="m" href={entryHref('modes', mode.entryId)} className="hover:text-ember-l">{mode.degree}. {mode.name}</Link>,
              mode.root,
              mode.notes.join(' '),
              mode.feel,
            ])}
          />
        </PageSection>

        <PageSection id="triads" eyebrow="3. Triads" title={`The seven triads of ${key.name}`} description="Stack thirds on each note of the scale. The qualities always run major, minor, minor, major, major, minor, diminished.">
          <SimpleTable
            head={['Numeral', 'Chord', 'Notes', 'Quality']}
            rows={triads.map(triad => [
              triad.numeral,
              <Link key="c" href={entryHref('chords', triad.entryId)} className="font-bold text-cream hover:text-ember-l">{triad.name}</Link>,
              triad.notes.join(' '),
              triad.quality,
            ])}
          />
        </PageSection>

        <PageSection id="chord-types" eyebrow="4. Chord types" title={`Chord types built on ${key.root}`} description={`Each one starts from the ${key.root} triad and makes one change. Tap a chord to read how it is built and played.`}>
          <CardGrid>
            {chordTypeCards.map(({ type, chord }) => (
              <ChordCard
                key={type.id}
                name={chord.name}
                notes={chord.notes}
                blurb={`${type.label}. ${type.blurb}`}
                href={type.entry ? entryHref(type.entry.category, type.entry.id) : undefined}
              />
            ))}
          </CardGrid>
          <h3 className="mt-10 font-display text-lg font-bold text-cream">Slash chords</h3>
          <p className="mt-1 text-sm text-outline">The same triad with a different note in the bass, listed bass note first.</p>
          <CardGrid className="mt-4">
            {slashChords.map(chord => (
              <ChordCard key={chord.name} name={chord.name} notes={chord.notes} href={entryHref('chords', 'slash-chords')} />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection id="strumming" eyebrow="5. Strumming" title="Patterns to play these chords with" description="Pick one pattern, hold one chord and play it until it is automatic. Then change chords without breaking the rhythm.">
          <CardGrid>
            {strumEntries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
          </CardGrid>
          <div className="mt-5"><ArrowLink href="/strumming">All strumming patterns</ArrowLink></div>
        </PageSection>

        <PageSection id="practice" eyebrow="6. Practice" title={`Progressions in ${key.name}`} description="One chord per bar. Open the practice player to hear the chords loop with a strumming pattern and a click.">
          <SimpleTable
            head={['Progression', 'Chords', '']}
            rows={PRACTICE_PROGRESSIONS.map(prog => [
              <Link key="p" href={entryHref('progressions', prog.entryId)} className="hover:text-ember-l">{prog.name} ({prog.numerals})</Link>,
              [...new Set(progressionChords(key, prog).map(c => c.name))].join('  '),
              <Link key="a" href={`/practice?key=${key.slug}&progression=${prog.id}`} className="inline-flex items-center gap-1.5 font-semibold text-ember-l hover:text-cream">
                Play along <ArrowRight size={14} aria-hidden="true" />
              </Link>,
            ])}
          />
        </PageSection>

        <PageSection id="solo" eyebrow="7. Solo" title={`Scales to solo with over ${key.name}`} description="Play any of these over the chords above. Land on the highlighted home note to sound resolved.">
          <div className="space-y-10">
            {solos.map((scale, i) => (
              <div key={scale.id}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream">{scale.label}</h3>
                    <p className="mt-1 text-sm text-outline">{scale.why}</p>
                  </div>
                  <ArrowLink href={entryHref(scale.guide.category, scale.guide.id)}>Solo guide</ArrowLink>
                </div>
                <NoteChips notes={scale.notes} tonic={scale.tonic} className="mt-3" />
                {i < 2 && <NoteMap className="mt-5" notes={scale.notes} tonic={scale.tonic} label={`${scale.label} notes on the fretboard`} />}
              </div>
            ))}
          </div>
        </PageSection>

        <section aria-label="Next steps" className="flex flex-col items-stretch gap-3 border-t border-line2 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Button href={`/practice?key=${key.slug}`} size="lg">Open the practice player in {key.root}</Button>
          <div className="flex gap-3">
            <Button href={`/keys/${previous.slug}`} variant="secondary">{previous.root}</Button>
            <Button href={`/keys/${next.slug}`} variant="secondary">{next.root} next</Button>
          </div>
        </section>
      </Container>
    </main>
  )
}
