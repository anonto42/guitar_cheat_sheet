import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { FOOTER_GROUPS } from '@/config/navigation'
import { SITE } from '@/config/site'
import Logo from '@/components/brand/Logo'
import Container from '@/components/ui/Container'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line2 bg-bg2/80 pb-[var(--safe-bottom)] backdrop-blur">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-outline">{SITE.description}</p>
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-outline transition-colors hover:text-ember-l"
            >
              <Code2 size={16} aria-hidden="true" />
              View the source on GitHub
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map(group => (
              <div key={group.title}>
                <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-cream">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-outline transition-colors hover:text-ember-l">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-outline/80 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. Free and open source.</p>
          <p>Works offline once installed.</p>
        </div>
      </Container>
    </footer>
  )
}
