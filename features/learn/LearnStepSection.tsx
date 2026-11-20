import CardGrid from '@/components/ui/CardGrid'
import EntryCard from '@/components/ui/EntryCard'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/ui/ScrollReveal'
import type { LearnStep } from '@/types'
import StepDoneButton from './StepDoneButton'

/** One numbered step of the learning path: goal, short intro, entries to study and an action to try. */
export default function LearnStepSection({ step }: { step: LearnStep }) {
  const headingId = `step-${step.slug}`
  return (
    <section id={step.slug} aria-labelledby={headingId} className="scroll-mt-24">
      <ScrollReveal variant="left">
        <div className="flex gap-5">
          <span aria-hidden="true" className="font-display text-5xl font-bold leading-none text-ember sm:text-6xl">{step.number}</span>
          <div className="min-w-0">
            <h2 id={headingId} className="font-display text-2xl font-bold text-cream sm:text-3xl">{step.title}</h2>
            <p className="mt-2 text-sm font-semibold text-ember-l">You can: {step.goal}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{step.intro}</p>
          </div>
        </div>
      </ScrollReveal>

      <CardGrid className="mt-6">
        {step.entries.map(entry => <EntryCard key={`${entry.category}/${entry.id}`} entry={entry} />)}
      </CardGrid>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href={step.action.href}>{step.action.label}</Button>
        <StepDoneButton slug={step.slug} />
      </div>
    </section>
  )
}
