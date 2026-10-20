import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@repo/ui/lib/utils';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import NavProgressBar from '@repo/ui/navigation/NavProgressBar';
import AppearanceSync from '@/components/navigation/appearance/AppearanceSync';
import AppearanceScript from '@/components/navigation/appearance/AppearanceScript';
import { DEFAULT_LOCALE_INTERNAL } from '@repo/shared/locales';
import { SITE_NAME } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['Sinytra Wiki', 'MMW'],
  url: process.env.NEXT_PUBLIC_NEXT_APP_URL
};

export default function RootDocument({
  lang = DEFAULT_LOCALE_INTERNAL,
  children
}: {
  lang?: string;
  children: ReactNode;
}) {
  return (
    <html lang={lang} data-theme="dark" className="cc--darkmode" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element */}
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
