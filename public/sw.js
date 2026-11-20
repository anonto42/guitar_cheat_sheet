/*
 * Guitar Cheat Sheet service worker.
 *
 * Strategy:
 *  - Hashed build assets (/_next/static) and fonts: cache first, they never change.
 *  - Pages and Next.js data requests: network first, fall back to the stored copy, then /offline.
 *  - Search index and public files: stale while revalidate.
 *  - On request from the page (CACHE_ALL), every page listed in /precache.json is stored,
 *    together with the scripts, styles and fonts each page references.
 *
 * Bump CACHE_VERSION if you change the strategy itself.
 */
const CACHE_VERSION = 'v1'
const STATIC_CACHE = `gcs-static-${CACHE_VERSION}`
const PAGE_CACHE = `gcs-pages-${CACHE_VERSION}`
const RUNTIME_CACHE = `gcs-runtime-${CACHE_VERSION}`
const ALL_CACHES = [STATIC_CACHE, PAGE_CACHE, RUNTIME_CACHE]

const SHELL = ['/', '/offline', '/download', '/search', '/search-index.json', '/favicon.svg', '/icon-192.png']
const NETWORK_TIMEOUT_MS = 4000

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGE_CACHE)
      // Individual failures must not abort installation.
      await Promise.allSettled(SHELL.map(url => pages.add(url)))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter(k => k.startsWith('gcs-') && !ALL_CACHES.includes(k)).map(k => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

const isStaticAsset = url => url.pathname.startsWith('/_next/static/')
const isRscRequest = request => request.headers.has('RSC') || new URL(request.url).searchParams.has('_rsc')

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      value => { clearTimeout(timer); resolve(value) },
      error => { clearTimeout(timer); reject(error) },
    )
  })
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function networkFirst(request, cacheName, { fallbackUrl, ignoreSearch = false } = {}) {
  const cache = await caches.open(cacheName)
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const hit = await cache.match(request, { ignoreSearch })
    if (hit) return hit
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl)
      if (fallback) return fallback
    }
    return Response.error()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  const refresh = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)
  return hit || (await refresh) || Response.error()
}

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/og') || url.pathname.startsWith('/api/')) return

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE, { fallbackUrl: '/offline', ignoreSearch: true }))
  } else if (isRscRequest(request)) {
    event.respondWith(networkFirst(request, PAGE_CACHE))
  } else {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
  }
})

/* ── Offline download ───────────────────────────────────────────── */

const ASSET_PATTERNS = [
  /\/_next\/static\/[^"'\\\s)<>]+/g,
  /(?<=["'(])static\/(?:chunks|css|media)\/[^"'\\\s)<>]+/g,
]

function extractAssets(text) {
  const found = new Set()
  for (const pattern of ASSET_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const path = match[0].startsWith('/_next/') ? match[0] : `/_next/${match[0]}`
      found.add(path)
    }
  }
  return found
}

async function broadcast(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  clients.forEach(client => client.postMessage(message))
}

async function storeAsset(path, staticCache, seen) {
  if (seen.has(path)) return
  seen.add(path)
  try {
    const cached = await staticCache.match(path)
    const response = cached || (await fetch(path))
    if (!response.ok) return
    if (!cached) await staticCache.put(path, response.clone())
    // Stylesheets reference font files: store those too.
    if (path.endsWith('.css')) {
      for (const asset of extractAssets(await response.clone().text())) await storeAsset(asset, staticCache, seen)
    }
  } catch {
    /* an asset that cannot be fetched is skipped; the page still works online */
  }
}

async function cacheEverything() {
  const manifestResponse = await fetch('/precache.json', { cache: 'no-store' })
  const manifest = await manifestResponse.json()
  const pages = await caches.open(PAGE_CACHE)
  const staticCache = await caches.open(STATIC_CACHE)
  const runtime = await caches.open(RUNTIME_CACHE)
  const seen = new Set()
  const total = manifest.routes.length + manifest.assets.length
  let done = 0

  const tick = () => broadcast({ type: 'CACHE_PROGRESS', done: ++done, total })

  const queue = [
    ...manifest.assets.map(url => async () => {
      try {
        const response = await fetch(url, { cache: 'reload' })
        if (response.ok) await runtime.put(url, response)
      } catch { /* optional asset */ }
      tick()
    }),
    ...manifest.routes.map(route => async () => {
      try {
        const response = await fetch(route, { cache: 'reload' })
        if (response.ok) {
          const html = await response.clone().text()
          await pages.put(route, response)
          for (const asset of extractAssets(html)) await storeAsset(asset, staticCache, seen)
        }
      } catch { /* retried on the next run */ }
      tick()
    }),
  ]

  // Small pool keeps the main thread and network responsive.
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) await queue.shift()()
  })
  await Promise.all(workers)
  await broadcast({ type: 'CACHE_DONE', version: manifest.version })
}

self.addEventListener('message', event => {
  const data = event.data || {}
  if (data.type === 'CACHE_ALL') {
    event.waitUntil(cacheEverything().catch(() => broadcast({ type: 'CACHE_ERROR' })))
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
