import {Suspense} from "react";
import DocsEntryPage from "@/components/docs/DocsEntryPage";
import DocsLoadingSkeleton from "@/components/docs/DocsLoadingSkeleton";
import {Metadata, ResolvingMetadata} from "next";
import sources, {folderMetaFile} from "@/lib/docs/sources";
import platforms from "@/lib/platforms";
import {setStaticParamsLocale} from "next-international/server";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata({params}: {
  params: { slug: string; path: string[]; locale: string }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const source = await sources.getProjectSource(params.slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  let title: string | undefined = undefined;
  try {
    const folderPath = params.path.slice(0, params.path.length - 1);
    const file = await sources.readMetadataFile(source, folderPath.join('/') + '/' + folderMetaFile, params.locale);
    const fileName = params.path[params.path.length - 1] + '.mdx';
    title = file[fileName];
  } catch (e) {
    // ignored
  }

  return {
    title: title ? `${title} - ${project.name}` : `${project.name} - ${(await parent).title?.absolute}`
  }
}

export default async function ModDocsPage({params}: { params: { slug: string; path: string[]; locale: string } }) {
  setStaticParamsLocale(params.locale);

  return (
    <Suspense fallback={<DocsLoadingSkeleton/>}>
      <DocsEntryPage slug={params.slug} path={params.path} locale={params.locale}/>
    </Suspense>
  )
}