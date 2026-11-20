import { buildPrecacheManifest } from '@/services/offline/precacheManifest'

export const dynamic = 'force-static'

/** Read by `public/sw.js` to learn which pages to store for offline use. */
export async function GET() {
  return Response.json(await buildPrecacheManifest())
}
