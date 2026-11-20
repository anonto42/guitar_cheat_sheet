import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface IconListItem {
  icon: LucideIcon
  text: string
}

interface IconListProps {
  items: IconListItem[]
  className?: string
}

/** Vertical list where each line starts with an accent icon. */
export default function IconList({ items, className }: IconListProps) {
  return (
    <ul className={cn('space-y-2.5', className)}>
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-3 text-sm text-cream">
          <Icon size={16} className="shrink-0 text-ember" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  )
}
