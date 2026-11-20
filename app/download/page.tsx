import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import DownloadOptions from '@/features/install/DownloadOptions'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Get the App',
  description: 'Install Guitar Cheat Sheet on Android, iPhone or desktop. The whole reference works offline.',
  alternates: { canonical: `${SITE.url}/download` },
}

const FAQ = [
  { q: 'Is it free?', a: 'Yes. Guitar Cheat Sheet is free and open source, with no ads and no account.' },
  { q: 'Does it work without internet?', a: 'Yes. The whole library is saved on your device automatically the first time you visit, so every page and the search keep working with no signal.' },
  { q: 'How do updates work?', a: 'The app checks for new content whenever you are online and refreshes the saved copy in the background.' },
]

export default function DownloadPage() {
  return (
    <main>
      <Container size="lg" className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Mobile and desktop"
          title="Get the Guitar Cheat Sheet app"
          description="Keep every scale, chord and technique in your pocket. Install it once and it works on stage, at rehearsal and on the train."
        />
        <div className="mt-10">
          <DownloadOptions />
        </div>

        <section aria-labelledby="faq" className="mt-16">
          <h2 id="faq" className="font-display text-xl font-bold text-cream">Questions</h2>
          <dl className="mt-5 divide-y divide-line rounded-xl border border-line2 bg-surface">
            {FAQ.map(item => (
              <div key={item.q} className="p-5">
                <dt className="text-sm font-bold text-cream">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-outline">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </main>
  )
}
