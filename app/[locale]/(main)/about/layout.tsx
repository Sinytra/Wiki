import {ReactNode} from "react";
import MetaDocsNavigation from "@/components/meta-docs/MetaDocsNavigation";
import {setContextLocale} from "@/lib/locales/routing";
import {useMessages} from "next-intl";
import localPreview from "@/lib/docs/localPreview";

export const dynamic = 'force-static';

export default function AboutLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode
}>) {
  setContextLocale(params.locale);

  const messages = useMessages();

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center page-wrapper-ext">
      <aside className="w-full md:w-64 shrink-0 bg-muted rounded-md px-2 mb-2 md:mb-0">
        <MetaDocsNavigation messages={messages['MetaDocsNavigation']} docsOnly={localPreview.isEnabled()}/>
      </aside>
      <div className="prose prose-h2:border-b prose-h2:border-b-neutral-700 prose-h2:pb-1 dark:prose-invert w-full max-w-[67rem] px-2 md:px-0">
        {children}
      </div>
    </div>
  )
}