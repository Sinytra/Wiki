import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import 'katex/dist/katex.min.css';
import './styles/katex.css';
import { ReactNode } from 'react';
import { getProcessURL } from '@/lib/utils';
import { cn } from '@repo/ui/lib/utils';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import NavProgressBar from '@repo/ui/navigation/NavProgressBar';
import AppearanceSync from '@/components/navigation/appearance/AppearanceSync';
import AppearanceScript from '@/components/navigation/appearance/AppearanceScript';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SITE_NAME,
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(getProcessURL()),
  openGraph: {
    siteName: SITE_NAME,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
  },
  other: {
    'darkreader-lock': 'true'
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['Sinytra Wiki', 'MMW'],
    url: process.env.NEXT_PUBLIC_NEXT_APP_URL
  };

  return (
    <html lang="en" data-theme="dark" className="cc--darkmode" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="describedby" href="/llms.txt" />
        <AppearanceScript />
      </head>
      <body className={cn(inter.className, 'flex min-h-screen flex-col bg-primary text-primary')}>
        <AppearanceSync />
        <NavProgressBar>
          <NuqsAdapter>{children}</NuqsAdapter>
        </NavProgressBar>
      </body>
    </html>
  );
}
