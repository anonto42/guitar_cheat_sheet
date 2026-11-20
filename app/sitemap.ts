import type { MetadataRoute } from 'next'
import { content } from '@/services/content'
import { SITE } from '@/config/site'
import { generateSitemapEntries } from '@/lib/seoGenerators'
import { CATEGORY_CONFIG } from '@/data/categories'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const entries = await content.listEntries()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/download`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/guitarfx`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const entryPages: MetadataRoute.Sitemap = entries.map(entry => ({
    url: `${SITE.url}/${entry.category}/${entry.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticPages, ...generateSitemapEntries(CATEGORY_CONFIG, SITE.url), ...entryPages]
}
