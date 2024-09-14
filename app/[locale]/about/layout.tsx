import {ReactNode} from "react";
import MetaDocsNavigation from "@/components/meta-docs/MetaDocsNavigation";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';

export default async function AboutLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode
}>) {
  setContextLocale(params.locale);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
      <aside className="w-full md:w-64 flex-shrink-0 bg-muted rounded-md px-2 mb-2 md:mb-0">
        <MetaDocsNavigation/>
      </aside>
      <div className="prose prose-h2:border-b prose-h2:border-b-neutral-700 prose-h2:pb-1 dark:prose-invert w-full max-w-[67rem] px-2 md:px-0">
        {children}
      </div>
    </div>
  )
}