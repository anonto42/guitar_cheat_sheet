import type { Metadata } from 'next'
import { WifiOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { LIBRARY_LINKS } from '@/config/navigation'
import RetryButton from './RetryButton'

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <main>
      <Container size="md" className="py-20 text-center">
        <WifiOff size={40} className="mx-auto text-ember" aria-hidden="true" />
        <h1 className="mt-5 font-display text-3xl font-bold text-cream">You are offline</h1>
        <p className="mx-auto mt-3 max-w-md text-outline">
          This page has not been saved on your device yet. Pages you have opened before, and the library
          if you saved it for offline, are still available.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <RetryButton />
          <Button href="/" variant="secondary">Go to home</Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {LIBRARY_LINKS.map(link => (
            <li key={link.slug}>
              <a href={link.href} className="inline-block rounded-full border border-line2 px-4 py-1.5 text-sm text-outline hover:border-ember/50 hover:text-cream">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  )
}
