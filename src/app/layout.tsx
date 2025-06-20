import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./styles/globals.css";
import {Toaster} from "@repo/ui/components/sonner";
import {ReactNode} from "react";
import {getProcessURL} from "@/lib/utils";
import {cn} from "@repo/ui/lib/utils";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import NavProgressBar from "@repo/ui/navigation/NavProgressBar";

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
    <body className={cn(inter.className, 'bg-primary text-primary flex min-h-screen flex-col')}>
    <NavProgressBar>
      <NuqsAdapter>
        {children}
      </NuqsAdapter>
    </NavProgressBar>
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
