import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./styles/globals.css";
import "./styles/colors.css";
import Providers from "@/components/navigation/nav-progress-bar";
import {Toaster} from "@/components/ui/sonner";
import {ReactNode} from "react";
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from "@vercel/speed-insights/next"
import {getProcessURL} from "@/lib/utils";

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
  return (
    <html lang="en">
    <body className={`${inter.className} dark flex flex-col min-h-screen`}>
    <Providers>
      {children}
    </Providers>
    <Toaster/>
    <Analytics/>
    <SpeedInsights/>
    </body>
    </html>
  );
}
