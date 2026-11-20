'use client'

import { useUrlParam } from '@/lib/useUrlParam'
import { ROOTS, rootFromSlug, rootSlug, type ScaleQuality } from '@/lib/music/scales'

/** The key chosen on an entry page, kept in the URL as ?key=f-sharp so it can be shared and linked from Learn. */
export function useEntryRoot(defaultRoot: string, quality: ScaleQuality) {
  const [slug, setSlug] = useUrlParam('key', rootSlug(defaultRoot))
  const root = rootFromSlug(slug, quality, defaultRoot)
  return { root, roots: ROOTS[quality], setRoot: (r: string) => setSlug(rootSlug(r)) }
}
