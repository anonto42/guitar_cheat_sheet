import ScrollReveal from './ScrollReveal'
import SectionHeading from './SectionHeading'

interface PageSectionProps {
  id: string
  title: string
  description?: string
  eyebrow?: string
  children: React.ReactNode
}

/** Anchored page section with a heading that slides in on scroll. */
export default function PageSection({ id, title, description, eyebrow, children }: PageSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <ScrollReveal variant="left">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} description={description} className="[&_h2]:text-xl sm:[&_h2]:text-2xl" />
      </ScrollReveal>
      <div className="mt-6">{children}</div>
    </section>
  )
}
