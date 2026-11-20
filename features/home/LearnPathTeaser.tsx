import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ArrowLink from '@/components/ui/ArrowLink'
import type { LearnStep } from '@/types'

/** Landing page strip that shows the seven learning steps and links into the full path. */
export default function LearnPathTeaser({ steps }: { steps: LearnStep[] }) {
  return (
    <section aria-labelledby="learn-teaser" className="scroll-mt-24">
      <Container>
        <ScrollReveal variant="left">
          <SectionHeading
            id="learn-teaser"
            eyebrow="Learning path"
            title="From your first scale to your first solo"
            description="Seven steps in the order a guitarist should learn them. Each one links to the reference pages and a hands-on action."
            action={<ArrowLink href="/learn">Open the path</ArrowLink>}
            className="[&_h2]:text-xl sm:[&_h2]:text-2xl [&_p]:text-sm"
          />
        </ScrollReveal>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.slug} as="li" delay={(i % 4) * 0.08}>
              <Link href={`/learn#${step.slug}`} className="block h-full border border-line2 bg-surface/80 p-4 transition-colors hover:bg-card">
                <span className="font-display text-3xl font-bold text-ember">{step.number}</span>
                <span className="mt-2 block text-sm font-bold text-cream">{step.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-outline">{step.goal}</span>
              </Link>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
