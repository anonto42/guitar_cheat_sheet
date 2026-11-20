import { ArrowRight, Download } from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import WordReveal from '@/components/ui/WordReveal'
import StatGrid, { type Stat } from '@/components/ui/StatGrid'

interface HeroSectionProps {
  topicCount: number
  categoryCount: number
}

export default function HeroSection({ topicCount, categoryCount }: HeroSectionProps) {
  const stats: Stat[] = [
    { value: topicCount, label: 'Topics' },
    { value: categoryCount, label: 'Categories' },
    { value: 12, label: 'Keys each' },
    { value: 'Free', label: 'Forever' },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-black/40 to-transparent">
      {/* Soft ember glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(255,107,0,.14),transparent_70%)]" />
      </div>

      <Container size="lg" className="py-16 text-center sm:py-24">
        <Reveal>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-ember">Free guitar reference</p>
        </Reveal>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-cream sm:text-5xl lg:text-6xl">
          <WordReveal
            delay={0.15}
            parts={[
              { text: 'Complete Guitar Reference:' },
              { text: 'Scales, Chords', accent: true },
              { text: '& More' },
            ]}
          />
        </h1>
        <Reveal delay={0.9}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Every scale, mode, chord, progression, technique and tuning shown in all 12 keys.
            Open any topic to explore notes, formulas and chord families.
          </p>
        </Reveal>

        <Reveal delay={1.15} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button href="#library" size="lg">
            Browse the library <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button href="/download" variant="secondary" size="lg">
            <Download size={16} aria-hidden="true" /> Get the app
          </Button>
        </Reveal>

        <Reveal delay={1.4}>
          <StatGrid stats={stats} className="mx-auto mt-14 max-w-2xl" />
        </Reveal>
      </Container>
    </section>
  )
}
