import type { Metadata } from 'next'
import { content } from '@/services/content'
import { SITE } from '@/config/site'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ChipNav from '@/components/ui/ChipNav'
import JsonLd from '@/components/seo/JsonLd'
import LearnProgress from '@/features/learn/LearnProgress'
import LearnStepSection from '@/features/learn/LearnStepSection'

export const metadata: Metadata = {
  title: 'Learn Guitar in Order: Scales, Keys, Modes, Chords, Strumming and Solos',
  description: 'A step-by-step path for guitarists: understand a scale, pick a key, learn its modes and triads, grow chord types, strum, then practise and solo. Free, with all 12 keys.',
  alternates: { canonical: `${SITE.url}/learn` },
}

export default async function LearnPage() {
  const steps = await content.getLearningPath()

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: 'Guitar learning path: scales to solos',
          description: 'A seven-step path from scales and keys through modes, triads, chord types and strumming to practising and soloing.',
          provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT10H' },
          syllabusSections: steps.map(step => ({ '@type': 'Syllabus', name: step.title, description: step.goal })),
        }}
      />
      <Container className="space-y-16 py-12 sm:py-16">
        <header className="space-y-6">
          <SectionHeading
            as="h1"
            eyebrow="Learning path"
            title="Learn guitar in the right order"
            description="Seven steps, each building on the last. Read the entries, try the action, mark the step done, then move on."
          />
          <LearnProgress total={steps.length} />
          <ChipNav label="Steps" items={steps.map(s => ({ href: `#${s.slug}`, label: `${s.number}. ${s.title}` }))} />
        </header>

        {steps.map(step => <LearnStepSection key={step.slug} step={step} />)}
      </Container>
    </main>
  )
}
