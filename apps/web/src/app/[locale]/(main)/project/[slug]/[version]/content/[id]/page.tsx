import {setContextLocale} from '@/lib/locales/routing';
import service from '@/lib/service';
import DocsPageNotFoundError from '@/components/docs/DocsPageNotFoundError';
import {notFound, redirect} from 'next/navigation';
import DocsEntryPage from '@/components/docs/body/DocsEntryPage';
import {getTranslations} from 'next-intl/server';
import DocsContentTOCSidebar from '@/components/docs/side/content/DocsContentTOCSidebar';
import DocsContentMetaSidebar from '@/components/docs/side/content/DocsContentMetaSidebar';
import {Metadata, ResolvingMetadata} from 'next';
import platforms from '@repo/shared/platforms';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import {ProjectContentContext, RenderedDocsPage} from '@repo/shared/types/service';
import ContentInfobox from '@/components/docs/side/content/ContentInfobox';
import DocsSimpleHeader from '@/components/docs/layout/DocsSimpleHeader';
import TogglableContent from '@/components/docs/content/TogglableContent';
import ContentChangelog from '@/components/docs/content/ContentChangelog';
import ContentListFooter from '@/components/docs/ContentListFooter';
import DocsContentPageToolsFooter from '@/components/docs/layout/DocsContentPageToolsFooter';
import issuesApi from '@repo/shared/api/issuesApi';
import resourceLocation from '@repo/shared/resourceLocation';
import {getContentLink} from '@/lib/project/game/content';

interface Props {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {id: encodedId, slug, version, locale} = await props.params;
  const id = decodeURIComponent(encodedId);
  const ctx = {id: slug, version, locale};

  const project = await service.getProject(ctx);
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const page = await service.getProjectContentPage(id, ctx);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }
  const {frontmatter} = page;

  const platformProject = await platforms.getPlatformProject(project);
  const iconUrl = frontmatter.icon ? await service.getAsset(frontmatter.icon, ctx) : null;

  return {
    title: frontmatter.title ? `${frontmatter.title} - ${platformProject.name}` : `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${slug}&locale=${locale}&id=${id}`]
    },
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
  const id = decodeURIComponent(params.id);

  // Backwards compat
  if (id.includes(':')) {
    const normalId = resourceLocation.parse(id)?.path;
    if (normalId) {
      return redirect(getContentLink(params, normalId));
    }
  }

  const ctx = {
    id: params.slug,
    version: params.version,
    locale: params.locale,
    contentId: id
  } satisfies ProjectContentContext;

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderProjectContentPage(id, ctx);
  } catch (e) {
    console.error('FATAL error rendering content page', e);

    const project = await service.getProject(ctx);
    if (project) {
      await issuesApi.reportPageRenderFailure(project, ctx.contentId, e, ctx.version, ctx.locale);
    }

    return (
      <DocsPageNotFoundError/>
    );
  }
  if (!page) {
    return notFound();
  }

  const t = await getTranslations('DocsContentRightSidebar');
  const u = await getTranslations('ContentChangelog');

  const contents = await service.getProjectContents(ctx);
  const headings = page.content.metadata.headings || [];

  return (
    <>
      <DocsSimpleHeader>
        {page.frontmatter.title || project.name}
      </DocsSimpleHeader>

      <div className="flex w-full max-w-[1700px] flex-1 flex-row justify-between gap-4">
        <ClientLocaleProvider keys={['DocsNonContentRightSidebar']}>
          <DocsContentTOCSidebar headings={headings}/>
        </ClientLocaleProvider>

        <main className={`
          mt-4 min-h-[86vh] flex-1 overflow-auto px-2 pb-4 sm:mt-0 sm:min-h-[auto] sm:max-w-5xl sm:pt-4 lg:px-0 lg:pt-2
        `}
        >
          <div className="mb-6 sm:hidden">
            {page.frontmatter.infobox != null &&
              <ContentInfobox project={project} ctx={ctx}
                              metadata={page.frontmatter.infobox} frontmatter={page.frontmatter}
                              properties={page.properties}
              />
            }
          </div>

          <DocsEntryPage page={page} project={project}/>

          {page.frontmatter.history &&
            <TogglableContent title={u('toggle')} className="mb-6">
              <ContentChangelog changelog={page.frontmatter.history}/>
            </TogglableContent>
          }

          {contents &&
            <ContentListFooter currentId={id} project={project} contents={contents} ctx={ctx}/>
          }

          <DocsContentPageToolsFooter project={project.id} local={project.local} id={id}
                                      editUrl={page.edit_url}/>
        </main>

        <DocsContentMetaSidebar id={id} project={project} title={t('title')} ctx={ctx} page={page}/>
      </div>
    </>
  );
}