import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost, Vazirmatn } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

const description =
  'Vira Marketing — architecture and interior design studio creating villas, interiors and offices where nature, light and architecture come together. | ویرا مارکتینگ، معماری و طراحی داخلی.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vira Marketing | Architecture & Interior Design',
    template: '%s | Vira Marketing',
  },
  description,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  keywords: [
    'Vira Marketing',
    'architecture',
    'interior design',
    'villa',
    'Tehran',
    'renovation',
    'landscape',
    'ویرا مارکتینگ',
    'معماری',
    'طراحی داخلی',
    'ویلا',
    'تهران',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Architecture & Interior Design',
  alternates: {
    canonical: '/',
    languages: { en: '/', fa: '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fa_IR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Vira Marketing | Architecture & Interior Design',
    description,
    images: [
      {
        url: '/images/featured.webp',
        width: 1600,
        height: 1067,
        alt: 'Vira Marketing — Niavaran Villa featured project',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vira Marketing | Architecture & Interior Design',
    description,
    images: ['/images/featured.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  alternateName: 'ویرا مارکتینگ',
  description:
    'Architecture and interior design studio creating villas, interiors and offices where nature, light and architecture come together.',
  url: SITE_URL,
  email: 'info@shadighader.com',
  image: `${SITE_URL}/images/featured.webp`,
  priceRange: '$$$',
  areaServed: 'Tehran, Iran',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tehran',
    addressCountry: 'IR',
  },
  sameAs: ['https://instagram.com/shadighader'],
}

export const viewport: Viewport = {
  themeColor: '#1c1815',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cormorant.variable} ${jost.variable} ${vazirmatn.variable}`}
    >
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
