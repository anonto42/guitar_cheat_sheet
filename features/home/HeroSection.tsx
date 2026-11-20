import { ArrowRight, Download } from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import StatGrid, { type Stat } from '@/components/ui/StatGrid'

interface HeroSectionProps {
  topicCount: number
  categoryCount: number
}

const STRING_OFFSETS = [18, 32, 46, 60, 74, 88]

export default function HeroSection({ topicCount, categoryCount }: HeroSectionProps) {
  const stats: Stat[] = [
    { value: topicCount, label: 'Topics' },
    { value: categoryCount, label: 'Categories' },
    { value: 12, label: 'Keys each' },
    { value: 'Free', label: 'Forever' },
  ]

  return (
    <section className="relative isolate overflow-hidden border-b border-line2 bg-gradient-to-b from-[#0a0908] to-bg">
      {/* Decorative strings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(255,107,0,.14),transparent_70%)]" />
        {STRING_OFFSETS.map((top, i) => (
          <div
            key={top}
            className="absolute inset-x-0 bg-gradient-to-r from-transparent via-outline/20 to-transparent"
            style={{ top: `${top}%`, height: i < 3 ? 1.5 : 1 }}
          />
        ))}
      </div>

      <Container size="lg" className="py-16 text-center sm:py-24">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-ember">Free guitar reference</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-cream sm:text-5xl lg:text-6xl">
          Complete Guitar Reference: <span className="text-ember">Scales, Chords</span>{' '}&amp; More
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Every scale, mode, chord, progression, technique and tuning shown in all 12 keys.
          Open any topic to explore notes, formulas and chord families.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button href="#library" size="lg">
            Browse the library <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button href="/download" variant="secondary" size="lg">
            <Download size={16} aria-hidden="true" /> Get the app
          </Button>
        </div>

        <StatGrid stats={stats} className="mx-auto mt-14 max-w-2xl" />
      </Container>
    </section>
  )
}
