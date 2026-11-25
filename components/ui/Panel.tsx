import { cn } from '@/lib/utils'

/** A boxed block of a tool page (studio, tuner): border, surface and the same padding everywhere. */
export default function Panel({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn('min-w-0 border border-line2 bg-surface/70 px-4 py-6 sm:px-6 sm:py-7', className)} {...props} />
}
