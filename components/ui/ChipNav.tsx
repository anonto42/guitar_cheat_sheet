interface ChipNavProps {
  items: { href: string; label: string }[]
  label: string
}

/** Horizontal list of in-page anchors. Scrolls sideways on phones. */
export default function ChipNav({ items, label }: ChipNavProps) {
  return (
    <nav aria-label={label} className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 whitespace-nowrap">
        {items.map(item => (
          <li key={item.href}>
            <a href={item.href} className="inline-block border border-line2 bg-surface/70 px-4 py-2 text-xs font-semibold text-outline transition-colors hover:border-ember/60 hover:text-ember-l">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
