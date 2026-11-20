import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'md' | 'lg' | 'xl'
}

const SIZES = { md: 'max-w-3xl', lg: 'max-w-5xl', xl: 'max-w-7xl' } as const

/** Centered page column with responsive gutters. */
export default function Container({ size = 'xl', className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZES[size], className)} {...props} />
}
