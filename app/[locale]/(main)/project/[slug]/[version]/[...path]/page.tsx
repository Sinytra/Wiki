import {Suspense} from "react";
import DocsEntryPage from "@/components/docs/DocsEntryPage";
import DocsLoadingSkeleton from "@/components/docs/DocsLoadingSkeleton";
import {Metadata, ResolvingMetadata} from "next";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import {redirect} from "next/navigation";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import platforms from "@/lib/platforms";
import DocsInnerLayoutClient from "@/components/docs/new/DocsInnerLayoutClient";
import DocsPageFooter from "@/components/docs/new/DocsPageFooter";
import DocsContentRightSidebar from "@/components/docs/new/DocsContentRightSidebar";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata({params}: {
  params: { slug: string; path: string[]; locale: string; version: string }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await service.getDocsPage(params.slug, params.path, params.version, params.locale);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }

  const project = await platforms.getPlatformProject(page.project);
  const result = matter(page.content).data as DocsEntryMetadata;

  return {
    title: result.title ? `${result.title} - ${project.name}` : `${project.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}&path=${params.path.join('/')}&version=${params.version}`]
    },
    other: {
      docs_source_mod: project.name,
      docs_source_icon: project.icon_url
    }
  }
}

export default async function ProjectDocsPage({params}: {
  params: { slug: string; path: string[]; locale: string; version: string; }
}) {
  setContextLocale(params.locale);

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }

  const page = await service.renderDocsPage(params.slug, params.path, params.version, params.locale);
  if (!page) redirect(`/project/${params.slug}/docs`);

  return (
    <DocsInnerLayoutClient project={page.project}
                           tree={projectData.tree}
                           version={params.version} locale={params.locale}
                           rightSidebar={
                            <DocsContentRightSidebar isOpen headings={page.content.metadata._headings || []}/>
                           }
                           footer={
                             <DocsPageFooter locale={params.locale} locales={projectData.project.locales}
                                             version={params.version} versions={projectData.project.versions}
                                             editUrl={page.edit_url} updatedAt={page.updated_at}
                             />
                           }
    >
      <Suspense fallback={<DocsLoadingSkeleton/>}>
        <DocsEntryPage locale={params.locale} locales={page.project.locales} page={page} path={params.path}
                       version={params.version} versions={page.project.versions}/>
      </Suspense>
    </DocsInnerLayoutClient>
  )
}