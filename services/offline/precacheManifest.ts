import { createHash } from 'node:crypto'
import { content } from '@/services/content'
import { MAJOR_KEYS } from '@/lib/music/keys'

export interface PrecacheManifest {
  /** Changes whenever the set of pages or their titles change. Clients use it to refresh their offline copy. */
  version: string
  /** Every page URL that should be readable offline. */
  routes: string[]
  /** Non-page resources the pages depend on. */
  assets: string[]
}

const STATIC_ROUTES = ['/', '/about', '/contact', '/privacy', '/download', '/search', '/guitarfx', '/offline', '/learn', '/practice', '/keys']

/** Builds the list of everything the app should store for offline use, derived from the content service. */
export async function buildPrecacheManifest(): Promise<PrecacheManifest> {
  const [categories, entries] = await Promise.all([content.listCategories(), content.listEntries()])
  const routes = [
    ...STATIC_ROUTES,
    ...MAJOR_KEYS.map(k => `/keys/${k.slug}`),
    ...categories.map(c => `/${c.slug}`),
    ...entries.map(e => `/${e.category}/${e.id}`),
  ]
  const assets = ['/search-index.json', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/guitar-processor.js']
  const version = createHash('sha1')
    .update(JSON.stringify([routes, entries.map(e => e.title)]))
    .digest('hex')
    .slice(0, 12)
  return { version, routes, assets }
}
