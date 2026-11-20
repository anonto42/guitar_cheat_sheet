interface ExplorerSectionProps {
  id?: string
  title: string
  hint?: string
  children: React.ReactNode
}

/** Titled block inside an entry page's interactive area. */
export default function ExplorerSection({ id, title, hint, children }: ExplorerSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <div>
        <h2 className="font-display text-xl font-bold text-cream">{title}</h2>
        {hint && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-outline">{hint}</p>}
      </div>
      {children}
    </section>
  )
}
