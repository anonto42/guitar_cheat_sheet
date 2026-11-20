import SoundLoader from '@/components/ui/SoundLoader'

/** Shown by Next.js while a route segment is loading. */
export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <SoundLoader size="lg" label="Tuning up" />
    </main>
  )
}
