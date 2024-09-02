import {ReactNode} from "react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import MetaDocsNavigation from "@/components/meta-docs/MetaDocsNavigation";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';

export default async function AboutLayout({params, children}: Readonly<{
  params: { slug: string; locale: string };
  children: ReactNode
}>) {
  setContextLocale(params.locale);

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0 bg-muted rounded-md px-2 pb-2">
        <DocsSidebarTitle offset>Navigation</DocsSidebarTitle>

        <MetaDocsNavigation/>
      </aside>
      <div className="prose dark:prose-invert w-full max-w-[67rem]">
        {children}
      </div>
    </div>
  )
}