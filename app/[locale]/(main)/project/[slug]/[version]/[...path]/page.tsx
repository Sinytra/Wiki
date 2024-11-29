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

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata({params}: {
  params: { slug: string; path: string[]; locale: string; version: string }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await service.getDocsPage(params.slug, params.path, params.version, params.locale);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }

  const project = await platforms.getPlatformProject(page.project.platform, page.project.slug);
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

  const page = await service.renderDocsPage(params.slug, params.path, params.version, params.locale);
  if (!page) redirect(`/project/${params.slug}/docs`);

  return (
    <Suspense fallback={<DocsLoadingSkeleton/>}>
      <DocsEntryPage page={page} path={params.path} version={params.version}/>
    </Suspense>
  )
}