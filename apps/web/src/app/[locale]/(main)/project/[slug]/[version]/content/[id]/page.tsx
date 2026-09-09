import { setContextLocale } from '@/lib/locales/routing';
import service from '@/lib/service';
import { notFound } from 'next/navigation';
import DocsEntryPage from '@/components/docs/body/DocsEntryPage';
import { getTranslations } from 'next-intl/server';
import DocsContentTOCSidebar from '@/components/docs/side/content/DocsContentTOCSidebar';
import DocsContentMetaSidebar from '@/components/docs/side/content/DocsContentMetaSidebar';
import { Metadata } from 'next';
import { projectPageMetadata } from '@/lib/seo';
import markdown from '@repo/markdown';
import platforms from '@repo/shared/platforms';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import { ProjectContentContext, RenderedDocsPage } from '@repo/shared/types/service';
import TogglableContent from '@/components/docs/content/TogglableContent';
import ContentChangelog from '@/components/docs/content/ContentChangelog';
import ContentListFooter from '@/components/docs/ContentListFooter';
import DocsContentPageToolsFooter from '@/components/docs/layout/DocsContentPageToolsFooter';
import issuesApi from '@repo/shared/api/issuesApi';
import DocsPageErrorBase from '@/components/docs/error/DocsPageErrorBase';
import { contentPagePath } from '@/lib/discovery/navigation';
import DocsFloatingNav from '@/components/docs/layout/DocsFloatingNav';

interface Props {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { id: encodedId, slug, version, locale } = params;
  const id = decodeURIComponent(encodedId);
  const ctx = { id: slug, version, locale };

  const project = await service.getProject(ctx);
  if (!project) {
    return {};
  }

  const page = await service.getProjectContentPage(id, ctx);
  if (!page) {
    return {};
  }
  const { frontmatter } = page;

  const platformProject = await platforms.getPlatformProjectOrNull(project);
  if (!platformProject) {
    return {};
  }

  const iconUrl = frontmatter.icon
    ? await service.getAsset(frontmatter.icon, ctx)
    : frontmatter.id?.[0]
      ? await service.getItemAsset(frontmatter.id[0], ctx)
      : null;

  return {
    ...(frontmatter.title ? { title: frontmatter.title } : {}),
    ...projectPageMetadata(project, params, {
      path: (prefix) => contentPagePath({ ...params, locale: prefix }, id),
      description: await markdown.describeMarkdown(page.content),
      image: { id },
      markdown: true
    }),
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url,
      // @ts-expect-error optional
      docs_icon: iconUrl ? iconUrl.src : undefined
    }
  };
}

export default async function ContentEntryPage(props: Props) {
  const params = await props.params;
  setContextLocale(params.locale);
  const ref = decodeURIComponent(params.id);

  const ctx = {
    id: params.slug,
    version: params.version,
    locale: params.locale,
    contentId: ref
  } satisfies ProjectContentContext;

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderProjectContentPage(ref, ctx);
  } catch (e) {
    console.error('FATAL error rendering content page', e);

    const project = await service.getProject(ctx);
    if (project) {
      await issuesApi.reportPageRenderFailure(project, ctx.contentId, e, ctx.version, ctx.locale);
    }

    return <DocsPageErrorBase />;
  }
  if (!page) {
    return notFound();
  }

  const t = await getTranslations('DocsContentRightSidebar');
  const u = await getTranslations('ContentChangelog');

  const contents = await service.getProjectContents(ctx);
  const headings = page.content.metadata.headings || [];

  const RightSidebar = ({ className }: { className?: string }) => (
    <DocsContentMetaSidebar className={className} project={project} title={t('title')} ctx={ctx} page={page} />
  );

  return (
    <>
      <div className="flex w-full max-w-[1700px] flex-1 flex-row justify-center gap-4 wide-layout:justify-between">
        <ClientLocaleProvider keys={['DocsNonContentRightSidebar', 'DocsFloatingNav']}>
          <DocsContentTOCSidebar headings={headings} />
        </ClientLocaleProvider>

        <main className="min-h-[86vh] flex-1 overflow-auto px-2 pt-2 pb-4 sm:min-h-auto sm:max-w-5xl xl:px-0">
          {/* Inner sidebar for small reading width */}
          <DocsEntryPage page={page} project={project} rightSidebar={<RightSidebar className="wide-layout:hidden" />} />

          {page.frontmatter.history && (
            <TogglableContent title={u('toggle')} className="mb-6">
              <ContentChangelog changelog={page.frontmatter.history} />
            </TogglableContent>
          )}

          <DocsContentPageToolsFooter
            className="mb-5"
            project={project.id}
            local={project.local}
            id={ref}
            editUrl={page.edit_url}
          />

          {contents && <ContentListFooter currentId={ref} project={project} contents={contents} ctx={ctx} />}
        </main>

        {/* Outer sidebar for large screens */}
        <RightSidebar className="hidden wide-layout:flex" />

        <DocsFloatingNav className="sm:hidden" />
      </div>
    </>
  );
}
