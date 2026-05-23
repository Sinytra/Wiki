import DocsEntryPage from '@/components/docs/body/DocsEntryPage';
import {Metadata, ResolvingMetadata} from 'next';
import {setContextLocale} from '@/lib/locales/routing';
import service from '@/lib/service';
import {notFound} from 'next/navigation';
import platforms from '@repo/shared/platforms';
import DocsInnerLayoutClient from '@/components/docs/layout/DocsInnerLayoutClient';
import DocsPageFooter from '@/components/docs/layout/DocsPageFooter';
import DocsGuideContentRightSidebar from '@/components/docs/side/guide/DocsGuideContentRightSidebar';
import DocsPageNotFoundError from '@/components/docs/DocsPageNotFoundError';
import DocsGuideNonContentRightSidebar from '@/components/docs/side/guide/DocsGuideNonContentRightSidebar';
import {constructPagePath} from '@/lib/service/serviceUtil';
import env from '@repo/shared/env';
import {RenderedDocsPage} from '@repo/shared/types/service';
import issuesApi from '@repo/shared/api/issuesApi';
import markdown from '@repo/markdown';

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string; path: string[]; locale: string; version: string }>
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {slug, version, locale, path} = await props.params;
  const ctx = {id: slug, version, locale};

  const project = await service.getProject(ctx);
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const page = await service.getDocsPage(path, false, ctx);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project);
  const result = await markdown.readProcessedFrontmatter(page.content) || {};
  const iconUrl = result.hide_icon === true || !result.icon && !result.id ? null
    : await service.getAsset((result.icon || result.id)!, ctx);

  return {
    title: result.title ? `${result.title} - ${platformProject.name}` : `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${slug}&locale=${locale}&path=${path.join('/')}&version=${version}`]
    },
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url,
      // @ts-expect-error optional
      docs_icon: iconUrl ? iconUrl.src : undefined
    }
  };
}

export default async function ProjectDocsPage(props: {
  params: Promise<{ slug: string; path: string[]; locale: string; version: string; }>
}) {
  const {slug, version, locale, path} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  const projectData = await service.getBackendLayout(ctx);
  if (!projectData) {
    return notFound();
  }

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderDocsPage(path, false, ctx);
  } catch (e) {
    console.error('FATAL error rendering page', e);

    await issuesApi.reportPageRenderFailure(project, constructPagePath(path), e, version, locale);

    return (
      <DocsPageNotFoundError project={project}/>
    );
  }
  if (!page) {
    return notFound();
  }

  const isContentPage = (page.content.metadata.id !== undefined || page.content.metadata.icon !== undefined)
    && page.content.metadata.hide_meta === undefined;
  const headings = page.content.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={page.content.metadata.title || project.name}
                           project={project}
                           tree={projectData.tree}
                           version={version} locale={locale}
                           showRightSidebar={isContentPage || headings.length > 0}
                           rightSidebar={
                             isContentPage
                               ? <DocsGuideContentRightSidebar project={project}
                                                               metadata={page.content.metadata}
                                                               version={version}/>
                               : <DocsGuideNonContentRightSidebar headings={headings}/>
                           }
                           footer={
                             <DocsPageFooter editUrl={page.edit_url}
                                             slug={slug} path={path}
                                             local={project.local}
                                             preview={isPreview}
                             />
                           }
    >
      <DocsEntryPage page={page} project={project} showHistory={page.content.metadata.history !== undefined}/>
    </DocsInnerLayoutClient>
  );
}