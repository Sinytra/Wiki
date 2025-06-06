import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/Footer";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

export const dynamic = 'force-static';

export default function BlogLayout({children}: Readonly<{ children: ReactNode }>) {
  setContextLocale('en');

  return (
    <>
      <ClientLocaleProvider keys={[]}>
        <Header locale="en" minimal unfix/>

        <div className="mx-2 mt-8 flex min-h-[100vh] flex-1 pb-24">
          <div className="flex w-full flex-col items-center gap-4">
            <div
              className={`
                prose w-full max-w-4xl px-2 md:px-0 dark:prose-invert prose-h2:border-b prose-h2:border-b-neutral-700
                prose-h2:pb-1
              `}>
              {children}
            </div>
          </div>
        </div>

        <Footer/>
      </ClientLocaleProvider>
    </>
  )
}