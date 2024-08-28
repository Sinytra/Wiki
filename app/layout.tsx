import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "./colors.css";
import Header from "../components/navigation/header";
import Providers from "@/components/navigation/nav-progress-bar";
import Footer from "@/components/navigation/footer";
import {Toaster} from "@/components/ui/sonner";
import {ReactNode} from "react";

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: 'Sinytra Modded MC Wiki',
  description: "The Wiki for all of Modded Minecraft"
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${inter.className} dark flex flex-col min-h-screen`}>
    <Providers>
      <Header/>

      <div className="page-wrapper flex flex-1 min-h-[100vh] mx-2">
        {children}
      </div>

      <Footer />
    </Providers>
    <Toaster />
    <Analytics />
    <SpeedInsights />
    </body>
    </html>
  );
}
