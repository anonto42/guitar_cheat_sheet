import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    categories: ['music', 'education', 'reference'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Scales', url: '/scales', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Chords', url: '/chords', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Search', url: '/search', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
