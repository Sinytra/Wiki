import ModDocsBaseLayout from "@/components/docs/layout/ModDocsBaseLayout";
import DocsTree from "@/components/docs/DocsTree";
import sources from "@/lib/docs/sources";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export default async function ModLayout({children, params}: Readonly<{
  children: ReactNode;
  params: { slug: string; locale: string }
}>) {
  await sources.getProjectSourceOrRedirect(params.slug, params.locale);

  setContextLocale(params.locale);

  return (
    <ModDocsBaseLayout leftPanel={<DocsTree slug={params.slug} locale={params.locale}/>}>
      {children}
    </ModDocsBaseLayout>
  )
}