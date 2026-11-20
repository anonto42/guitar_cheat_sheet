import { Children } from 'react'
import { cn } from '@/lib/utils'
import ScrollReveal from './ScrollReveal'

interface CardGridProps {
  children: React.ReactNode
  className?: string
}

/** Responsive 1/2/3 column list. Each child is a list item that rises into view as it is scrolled to, staggered by column. */
export default function CardGrid({ children, className }: CardGridProps) {
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Children.map(children, (child, i) => (
        <ScrollReveal as="li" delay={(i % 3) * 0.1}>{child}</ScrollReveal>
      ))}
    </ul>
  )
}
