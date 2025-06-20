import {ReactNode} from "react";
import MetaDocsNavigation from "@/components/meta-docs/MetaDocsNavigation";
import {setContextLocale} from "@/lib/locales/routing";
import env from "@repo/shared/env";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export const dynamic = 'force-static';

export default function AboutLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode
}>) {
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-ext flex w-full flex-col gap-4 md:flex-row md:justify-center">
      <aside className="mb-2 w-full shrink-0 rounded-md bg-primary-alt px-2 md:mb-0 md:w-64">
        <ClientLocaleProvider keys={['MetaDocsNavigation']}>
          <MetaDocsNavigation docsOnly={env.isPreview()}/>
        </ClientLocaleProvider>
      </aside>
      <div className={`
        prose w-full max-w-[67rem] px-2 md:px-0 dark:prose-invert prose-h2:border-b prose-h2:border-b-neutral-700
        prose-h2:pb-1
      `}>
        {children}
      </div>
    </div>
  )
}