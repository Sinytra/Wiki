import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./styles/globals.css";
import Providers from "@/components/navigation/nav-progress-bar";
import {Toaster} from "@/components/ui/sonner";
import {ReactNode} from "react";
import {cn, getProcessURL} from "@/lib/utils";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: 'Modded Minecraft Wiki',
  description: 'The Wiki for all of Modded Minecraft. Presented by Sinytra.',
  metadataBase: new URL(getProcessURL()),
  openGraph: {
    siteName: 'Modded Minecraft Wiki',
    type: 'website',
    url: process.env.NEXT_PUBLIC_NEXT_APP_URL
  },
  other: {
    'darkreader-lock': 'true'
  }
};

export default function LocaleLayout({children}: Readonly<{ children: ReactNode; }>) {
  const jsonLd = {
    '@context' : 'https://schema.org',
    '@type' : 'WebSite',
    name : 'Modded Minecraft Wiki',
    alternateName : ['Sinytra Wiki', 'MMW'],
    url : process.env.NEXT_PUBLIC_NEXT_APP_URL
  };

  return (
    <html lang="en" data-theme="dark">
    <head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </head>
    <body className={cn(inter.className, 'flex flex-col min-h-screen bg-primary text-primary')}>
    <Providers>
      {children}
    </Providers>
    {/* TODO Font size */}
    <Toaster toastOptions={{
      style: {
        background: 'var(--background-color-primary-alt)',
        fontStyle: 'var(--text-sm)'
      }
    }}/>
    </body>
    </html>
  );
}
