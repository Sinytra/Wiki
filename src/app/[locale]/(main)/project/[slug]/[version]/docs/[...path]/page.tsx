import {Suspense} from "react";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import {Metadata, ResolvingMetadata} from "next";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import {redirect} from "next/navigation";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@repo/shared/types/metadata";
import platforms from "@repo/platforms";
import DocsInnerLayoutClient from "@/components/docs/layout/DocsInnerLayoutClient";
import DocsPageFooter from "@/components/docs/layout/DocsPageFooter";
import DocsGuideContentRightSidebar from "@/components/docs/side/guide/DocsGuideContentRightSidebar";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import DocsGuideNonContentRightSidebar from "@/components/docs/side/guide/DocsGuideNonContentRightSidebar";
import {constructPagePath} from "@/lib/service/serviceUtil";
import env from "@repo/shared/env";
import {RenderedDocsPage} from "@repo/shared/types/service";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import issuesApi from "@repo/shared/api/issuesApi";
import locales from "@repo/shared/lang/locales";
import network from "@repo/shared/network";

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

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderDocsPage(params.slug, params.path, params.version, params.locale);
  } catch (e) {
    console.error('FATAL error rendering page', e);

    await issuesApi.reportPageRenderFailure(projectData.project, constructPagePath(params.path), e,
      network.actualVersion(params.version), locales.actualLocale(params.locale));

    return (
      <DocsPageNotFoundError project={projectData.project}/>
    );
  }
  if (!page) redirect(`/project/${params.slug}/${DEFAULT_DOCS_VERSION}`);

  const isContentPage = (page.content.metadata.id !== undefined || page.content.metadata.icon !== undefined)
    && page.content.metadata.hide_meta === undefined;
  const headings = page.content.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={page.content.metadata.title || page.project.name}
                           project={page.project}
                           tree={projectData.tree}
                           version={params.version} locale={params.locale}
                           showRightSidebar={isContentPage || headings.length > 0}
                           rightSidebar={
                             isContentPage
                               ? <DocsGuideContentRightSidebar project={projectData.project}
                                                               metadata={page.content.metadata}
                                                               version={params.version}/>
                               : <DocsGuideNonContentRightSidebar headings={headings}/>
                           }
                           footer={
                             <DocsPageFooter editUrl={page.edit_url}
                                             slug={params.slug} path={params.path}
                                             local={projectData.project.local}
                                             preview={isPreview}
                             />
                           }
    >
      <Suspense fallback={<DocsLoadingSkeleton/>}>
        <DocsEntryPage page={page} showHistory={page.content.metadata.history !== undefined}/>
      </Suspense>
    </DocsInnerLayoutClient>
  )
}