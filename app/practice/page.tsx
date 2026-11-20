import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SITE } from '@/config/site'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import SoundLoader from '@/components/ui/SoundLoader'
import PracticeStudio from '@/features/practice/PracticeStudio'

export const metadata: Metadata = {
  title: 'Guitar Practice Player: Chord Progressions, Strumming and Solo Scales',
  description: 'Loop a chord progression in any of the 12 keys with a strumming pattern and a click, then solo over it with the matching scale shown on the fretboard.',
  alternates: { canonical: `${SITE.url}/practice` },
}

export default function PracticePage() {
  return (
    <main>
      <Container className="space-y-10 py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Step 7 of the learning path"
          title="Practice player"
          description="Choose a key, a progression and a strumming pattern, press play, and strum along. When you are ready, solo over the same loop with the scale below."
        />
        <Suspense fallback={<div className="flex justify-center py-20"><SoundLoader label="Loading player" /></div>}>
          <PracticeStudio />
        </Suspense>
      </Container>
    </main>
  )
}
