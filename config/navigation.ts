import { CATEGORY_CONFIG } from '@/data/categories'
import type { CategorySlug } from '@/types'

export interface NavLink {
  label: string
  href: string
}

export interface LibraryLink extends NavLink {
  slug: CategorySlug
  description: string
  accent: string
}

/** Entries of the "Library" dropdown, derived from the category config. */
export const LIBRARY_LINKS: LibraryLink[] = (Object.keys(CATEGORY_CONFIG) as CategorySlug[]).map(slug => ({
  slug,
  label: CATEGORY_CONFIG[slug].label,
  href: `/${slug}`,
  description: CATEGORY_CONFIG[slug].desc,
  accent: CATEGORY_CONFIG[slug].a,
}))

export const PRIMARY_LINKS: NavLink[] = [
  { label: 'Learn', href: '/learn' },
  { label: 'Practice', href: '/practice' },
  { label: 'GuitarFX', href: '/guitarfx' },
  { label: 'About', href: '/about' },
]

export const FOOTER_GROUPS: { title: string; links: NavLink[] }[] = [
  { title: 'Library', links: LIBRARY_LINKS.map(({ label, href }) => ({ label, href })) },
  {
    title: 'Tools',
    links: [
      { label: 'Learning path', href: '/learn' },
      { label: 'All 12 keys', href: '/keys' },
      { label: 'Practice player', href: '/practice' },
      { label: 'GuitarFX Studio', href: '/guitarfx' },
      { label: 'Search', href: '/search' },
      { label: 'Get the app', href: '/download' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]
