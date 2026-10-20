import type { Metadata } from 'next';
import './styles/globals.css';
import 'katex/dist/katex.min.css';
import './styles/katex.css';
import { ReactNode } from 'react';
import { getProcessURL } from '@/lib/utils';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

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
  return children;
}
