import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif } from 'next/font/google'
import { content } from '@/services/content'
import { CATEGORY_CONFIG } from '@/data/categories'
import { SITE, SITE_TITLE } from '@/config/site'
import { generateKeywords } from '@/lib/seoGenerators'
import JsonLd from '@/components/seo/JsonLd'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegister from '@/features/offline/ServiceWorkerRegister'
import OfflineBanner from '@/features/offline/OfflineBanner'
import NativeBootstrap from '@/features/install/NativeBootstrap'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif', display: 'swap' })

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  const entries = await content.listEntries()
  return {
    metadataBase: new URL(SITE.url),
    applicationName: SITE.name,
    title: { default: SITE_TITLE, template: `%s | ${SITE.name}` },
    description: SITE.description,
    keywords: generateKeywords(entries, CATEGORY_CONFIG),
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    category: 'Music Education',
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url: SITE.url,
      siteName: SITE.name,
      title: SITE_TITLE,
      description: SITE.description,
      images: [{ url: '/og', width: 1200, height: 630, alt: SITE_TITLE }],
    },
    twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE.description, images: ['/og'] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    appleWebApp: { capable: true, title: SITE.shortName, statusBarStyle: 'black-translucent' },
    formatDetection: { telephone: false },
  }
}

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: 'en-US',
      publisher: { '@id': `${SITE.url}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon-512.png`,
      description: 'Free online guitar education reference.',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable}`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <JsonLd data={siteJsonLd} />
        <Navbar />
        <OfflineBanner />
        {children}
        <Footer />
        <ServiceWorkerRegister />
        <NativeBootstrap />
      </body>
    </html>
  )
}
