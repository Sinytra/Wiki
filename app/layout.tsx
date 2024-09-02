import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "./colors.css";
import Providers from "@/components/navigation/nav-progress-bar";
import {Toaster} from "@/components/ui/sonner";
import {ReactNode} from "react";
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from "@vercel/speed-insights/next"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: 'Sinytra Modded Wiki',
  description: 'The Wiki for all of Modded Minecraft',
  openGraph: {
    siteName: 'Sinytra Modded Wiki',
    type: 'website',
    url: process.env.NEXT_APP_URL
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
