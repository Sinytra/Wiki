import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import MetaDevDocsNavigation from "@/components/meta-docs/MetaDevDocsNavigation";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

export const dynamic = 'force-static';

export default function AboutLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode
}>) {
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-ext flex w-full flex-col gap-4 md:flex-row md:justify-center">
      <aside className="bg-primary-alt mb-2 w-full shrink-0 rounded-md px-2 md:mb-0 md:w-64">
        <ClientLocaleProvider keys={['MetaDevDocsNavigation']}>
          <MetaDevDocsNavigation/>
        </ClientLocaleProvider>
      </aside>
      <div className={`
        prose w-full max-w-[67rem] px-2 dark:prose-invert prose-h2:border-b prose-h2:border-b-neutral-700 prose-h2:pb-1
        md:px-0
      `}>
        {children}
      </div>
    </div>
  )
}