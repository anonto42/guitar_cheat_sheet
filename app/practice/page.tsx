import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SITE } from '@/config/site'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SoundLoader from '@/components/ui/SoundLoader'
import PracticeStudio from '@/features/practice/PracticeStudio'

export const metadata: Metadata = {
  title: 'Guitar Practice Studio: Backing Tracks, Strumming, Recording and Solo Scales',
  description: 'Build a backing track in any key with your own chords and bars, choose guitar, piano, bass and drums, set the tempo, record yourself and see which notes to solo with.',
  alternates: { canonical: `${SITE.url}/practice` },
}

export default function PracticePage() {
  return (
    <main>
      <Container className="space-y-10 py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Step 7 of the learning path"
          title="Practice Studio"
          description="Build a backing track: pick a key, choose or change the chords in each bar, set the rhythm and the sound. Press Play and strum or solo along. Press Record to capture yourself."
        />
        <Suspense fallback={<div className="flex justify-center py-20"><SoundLoader label="Loading player" /></div>}>
          <PracticeStudio />
        </Suspense>
      </Container>
    </main>
  )
}
