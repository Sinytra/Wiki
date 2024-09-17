import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import BlogHeader from "@/components/navigation/BlogHeader";

export const dynamic = 'force-static';

export default function BlogLayout({children}: Readonly<{ children: ReactNode }>) {
  setContextLocale('en');

  return (
    <>
      <BlogHeader />

      {children}
    </>
  )
}