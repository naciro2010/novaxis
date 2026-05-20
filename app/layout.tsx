import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n';
import SmoothScroll from '@/components/SmoothScroll';

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
  metadataBase: new URL('https://novaxis.ma'),
  title: {
    default: 'NOVAXIS — L\'axe nouveau de la finance augmentée',
    template: '%s · NOVAXIS'
  },
  description:
    'NOVAXIS fusionne expertise comptable marocaine et intelligence artificielle souveraine pour augmenter la gestion des entreprises. Hébergé au Maroc, conforme CNDP.',
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
    title: 'NOVAXIS — L\'axe nouveau de la finance augmentée',
    description:
      'Comptabilité × Intelligence. Souveraineté marocaine. Plateformes de gestion augmentées par IA, hébergées au Maroc.',
    url: 'https://novaxis.ma',
    siteName: 'NOVAXIS',
    locale: 'fr_MA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVAXIS — Comptabilité × Intelligence',
    description:
      'IA souveraine pour la gestion des entreprises marocaines. Hébergé au Maroc, conforme CNDP.'
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-ink-900 text-bone antialiased">
        <LocaleProvider>
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
              name: 'NOVAXIS',
              url: 'https://novaxis.ma',
              logo: 'https://novaxis.ma/logo.svg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Rabat',
                addressRegion: 'Agdal',
                addressCountry: 'MA'
              },
              sameAs: ['https://linkedin.com/company/novaxis']
            })
          }}
        />
      </body>
    </html>
  );
}
