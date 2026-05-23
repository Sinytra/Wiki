import {setContextLocale} from '@/lib/locales/routing';
import platforms from '@repo/shared/platforms';
import service from '@/lib/service';
import {notFound} from 'next/navigation';
import DocsInnerLayoutClient from '@/components/docs/layout/DocsInnerLayoutClient';
import DocsPageFooter from '@/components/docs/layout/DocsPageFooter';
import DocsGuideNonContentRightSidebar from '@/components/docs/side/guide/DocsGuideNonContentRightSidebar';
import {getTranslations} from 'next-intl/server';
import env from '@repo/shared/env';
import {RenderedDocsHomepage, renderHomepage} from '@/components/docs/DocsHomepage';

interface PageProps {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
  }>;
}

export default async function ProjectDocsHomepage(props: PageProps) {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);
  const t = await getTranslations('ProjectDocsHomepage');

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  const projectData = await service.getBackendLayout(ctx);
  if (!projectData) {
    return notFound();
  }

  const platformProject = await platforms.getPlatformProject(project);

  const content = await renderHomepage(project, platformProject, ctx);
  const headings = content?.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={t('title')}
                           project={project}
                           tree={projectData.tree}
                           version={version} locale={locale}
                           showRightSidebar={headings.length > 0}
                           rightSidebar={<DocsGuideNonContentRightSidebar headings={headings}/>}
                           footer={<DocsPageFooter slug={slug} preview={isPreview}/>}
    >
      <RenderedDocsHomepage content={content}/>
    </DocsInnerLayoutClient>
  );
}
