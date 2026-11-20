import type { Metadata } from 'next'
import { SITE } from '@/config/site'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Tuner from '@/features/tuner/Tuner'

export const metadata: Metadata = {
  title: 'Free Online Guitar Tuner: Standard, Drop D, Open and Down Tunings',
  description: 'Tune your guitar with your microphone in standard, drop D, half step down, open G, open D, DADGAD and more. Works offline, nothing is uploaded.',
  alternates: { canonical: `${SITE.url}/tuner` },
}

export default function TunerPage() {
  return (
    <main>
      <Container size="lg" className="space-y-8 py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Tool"
          title="Guitar tuner"
          description="Pick a tuning, press Start and play one string at a time. The sound stays on your device. No microphone? Tap the speaker on each string and tune by ear."
        />
        <Tuner />
      </Container>
    </main>
  )
}
