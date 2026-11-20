import { Children } from 'react'
import { cn } from '@/lib/utils'

interface CardGridProps {
  children: React.ReactNode
  className?: string
}

/** Responsive 1/2/3 column list. Each child is wrapped in a list item. */
export default function CardGrid({ children, className }: CardGridProps) {
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Children.map(children, child => <li>{child}</li>)}
    </ul>
  )
}
