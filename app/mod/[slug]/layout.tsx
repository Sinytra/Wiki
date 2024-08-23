import {redirect, RedirectType} from "next/navigation";
import ModDocsBaseLayout from "@/components/docs/layout/ModDocsBaseLayout";
import DocsTree from "@/components/docs/DocsTree";
import sources from "@/lib/docs/sources";

export default async function ModLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: { slug: string }
}>) {
  try {
    await sources.getProjectSource(params.slug);

    return (
      <ModDocsBaseLayout leftPanel={<DocsTree slug={params.slug}/>}>
        {children}
      </ModDocsBaseLayout>
    )
  } catch (e) {
    redirect('/', RedirectType.replace);
  }
}