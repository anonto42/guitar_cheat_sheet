/**
 * BUILD_TARGET=mobile produces a fully static export in ./out for the Capacitor
 * native shell (see scripts/build-mobile.mjs). Otherwise this is a normal web build.
 */
const isMobile = process.env.BUILD_TARGET === 'mobile'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isMobile
    ? { output: 'export', trailingSlash: true, images: { unoptimized: true } }
    : {
        async headers() {
          return [
            {
              // The service worker must never be served from a stale HTTP cache.
              source: '/sw.js',
              headers: [
                { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
                { key: 'Service-Worker-Allowed', value: '/' },
              ],
            },
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              ],
            },
          ]
        },
      }),
}

module.exports = nextConfig
