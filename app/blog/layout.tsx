import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import Header from "@/components/navigation/header";
import {NextIntlClientProvider} from "next-intl";

export const dynamic = 'force-static';

export default function BlogLayout({children}: Readonly<{ children: ReactNode }>) {
  setContextLocale('en');

  return (
    <>
      <NextIntlClientProvider messages={{}}>
        <Header locale="en" minimal unfix/>

        <div className="flex flex-1 min-h-[100vh] mx-2 mt-8 pb-24">
          <div className="flex flex-col gap-4 w-full items-center">
            <div
              className="prose prose-h2:border-b prose-h2:border-b-neutral-700 prose-h2:pb-1 dark:prose-invert w-full max-w-4xl px-2 md:px-0">
              {children}
            </div>
          </div>
        </div>

      </NextIntlClientProvider>
    </>
  )
}