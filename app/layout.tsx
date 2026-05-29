import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';
import SmoothScroll from '@/components/SmoothScroll';
import SiteBackground from '@/components/SiteBackground';
import Preloader from '@/components/Preloader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — L'axe nouveau de la finance augmentée`,
    template: `%s · ${BRAND.name}`
  },
  description:
    `${BRAND.name} fusionne expertise comptable marocaine et intelligence artificielle souveraine pour augmenter la gestion des entreprises. Hébergé au Maroc, conforme CNDP.`,
  keywords: [
    'IA Maroc',
    'comptabilité augmentée',
    'souveraineté numérique',
    'CNDP',
    'OCR factures',
    'Rabat',
    'Mistral AI',
    'IA souveraine'
  ],
  openGraph: {
    title: `${BRAND.name} — L'axe nouveau de la finance augmentée`,
    description:
      'Comptabilité × Intelligence. Souveraineté marocaine. Plateformes de gestion augmentées par IA, hébergées au Maroc.',
    url: BRAND.url,
    siteName: BRAND.name,
    locale: 'fr_MA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — Comptabilité × Intelligence`,
    description:
      'IA souveraine pour la gestion des entreprises marocaines. Hébergé au Maroc, conforme CNDP.'
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: '#0A0A18',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-ink-950 text-bone antialiased">
        <LocaleProvider>
          <Preloader />
          <SiteBackground />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </LocaleProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: BRAND.name,
              url: BRAND.url,
              logo: `${BRAND.url}/logo.svg`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Rabat',
                addressRegion: 'Agdal',
                addressCountry: 'MA'
              },
              sameAs: [BRAND.linkedin]
            })
          }}
        />
      </body>
    </html>
  );
}
