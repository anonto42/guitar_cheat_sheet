import { content } from '@/services/content'

export const dynamic = 'force-static'

/** Compact search index consumed by the navbar search. Cached by the service worker for offline use. */
export async function GET() {
  const index = await content.getSearchIndex()
  return Response.json(index, { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } })
}
