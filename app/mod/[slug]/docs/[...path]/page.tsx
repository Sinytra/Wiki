import {Suspense} from "react";
import DocsEntryPage from "@/components/docs/DocsEntryPage";
import DocsLoadingSkeleton from "@/components/docs/DocsLoadingSkeleton";
import {Metadata, ResolvingMetadata} from "next";
import sources, {folderMetaFile} from "@/lib/docs/sources";
import platforms from "@/lib/platforms";

export async function generateMetadata({params}: {
  params: { slug: string; path: string[] }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const source = await sources.getProjectSource(params.slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  let title: string | undefined = undefined;
  try {
    const folderPath = params.path.slice(0, params.path.length - 1);
    const file = await sources.readMetadataFile(source, folderPath.join('/') + '/' + folderMetaFile);
    const fileName = params.path[params.path.length - 1] + '.mdx';
    title = file[fileName];
  } catch (e) {
    
  }

  return {
    title: title ? `${title} - ${project.name}` : `${project.name} - ${(await parent).title?.absolute}`
  }
}

export default function ModDocsPage({params}: { params: { slug: string; path: string[] } }) {
  return (
    <Suspense fallback={<DocsLoadingSkeleton/>}>
      <DocsEntryPage slug={params.slug} path={params.path}/>
    </Suspense>
  )
}