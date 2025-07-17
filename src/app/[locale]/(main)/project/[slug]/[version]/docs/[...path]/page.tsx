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
import issuesApi from "@repo/shared/api/issuesApi";
import navigation from "@/lib/navigation";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string; path: string[]; locale: string; version: string }>
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {slug, version, locale, path} = await props.params;
  const ctx = {id: slug, version, locale};
  const page = await service.getDocsPage(path, false, ctx);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }

  const project = await platforms.getPlatformProject(page.project);
  const result = matter(page.content).data as DocsEntryMetadata;
  const iconUrl = result.hide_icon === true || !result.icon && !result.id ? null
    : await service.getAsset((result.icon || result.id)!, ctx);

  return {
    title: result.title ? `${result.title} - ${project.name}` : `${project.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${slug}&locale=${locale}&path=${path.join('/')}&version=${version}`]
    },
    other: {
      docs_source_mod: project.name,
      docs_source_icon: project.icon_url,
      // @ts-expect-error optional
      docs_icon: iconUrl ? iconUrl.src : undefined
    }
  }
}

export default async function ProjectDocsPage(props: { params: Promise<{ slug: string; path: string[]; locale: string; version: string; }> }) {
  const {slug, version, locale, path} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);

  const projectData = await service.getBackendLayout(ctx);
  if (!projectData) {
    return redirect('/');
  }

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderDocsPage(path, false, ctx);
  } catch (e) {
    console.error('FATAL error rendering page', e);

    await issuesApi.reportPageRenderFailure(projectData.project, constructPagePath(path), e, version, locale);

    return (
      <DocsPageNotFoundError project={projectData.project}/>
    );
  }
  if (!page) redirect(navigation.getProjectLink(slug));

  const isContentPage = (page.content.metadata.id !== undefined || page.content.metadata.icon !== undefined)
    && page.content.metadata.hide_meta === undefined;
  const headings = page.content.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={page.content.metadata.title || page.project.name}
                           project={page.project}
                           tree={projectData.tree}
                           version={version} locale={locale}
                           showRightSidebar={isContentPage || headings.length > 0}
                           rightSidebar={
                             isContentPage
                               ? <DocsGuideContentRightSidebar project={projectData.project}
                                                               metadata={page.content.metadata}
                                                               version={version}/>
                               : <DocsGuideNonContentRightSidebar headings={headings}/>
                           }
                           footer={
                             <DocsPageFooter editUrl={page.edit_url}
                                             slug={slug} path={path}
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