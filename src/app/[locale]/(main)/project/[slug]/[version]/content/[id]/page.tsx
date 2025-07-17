import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import {redirect} from "next/navigation";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import {Suspense} from "react";
import {getTranslations} from "next-intl/server";
import DocsContentTOCSidebar from "@/components/docs/side/content/DocsContentTOCSidebar";
import DocsContentMetaSidebar from "@/components/docs/side/content/DocsContentMetaSidebar";
import {Metadata, ResolvingMetadata} from "next";
import platforms from "@repo/platforms";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@repo/shared/types/metadata";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {ProjectContentContext, RenderedDocsPage} from "@repo/shared/types/service";
import DocsContentMetaSidebarBody from "@/components/docs/side/content/DocsContentMetaSidebarBody";
import DocsSimpleHeader from "@/components/docs/layout/DocsSimpleHeader";
import TogglableContent from "@/components/docs/content/TogglableContent";
import ContentChangelog from "@/components/docs/content/ContentChangelog";
import ContentListFooter from "@/components/docs/ContentListFooter";

interface Props {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {id, slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  const page = await service.getProjectContentPage(id, ctx);
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
      images: [`/api/og?slug=${slug}&locale=${locale}&id=${id}`]
    },
    other: {
      docs_source_mod: project.name,
      docs_source_icon: project.icon_url,
      // @ts-expect-error optional
      docs_icon: iconUrl ? iconUrl.src : undefined
    }
  }
}

export default async function ContentEntryPage(props: Props) {
  const params = await props.params;
  setContextLocale(params.locale);
  const id = decodeURIComponent(params.id);
  const ctx = {
    id: params.slug,
    version: params.version,
    locale: params.locale,
    contentId: id
  } satisfies ProjectContentContext;

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderProjectContentPage(id, ctx);
  } catch (e) {
    console.error('FATAL error rendering content page', e);
    return (
      <DocsPageNotFoundError/>
    );
  }
  if (!page) redirect(`/project/${params.slug}/${params.version}/content`);

  const t = await getTranslations('DocsContentRightSidebar');
  const u = await getTranslations('ContentChangelog');

  const contents = await service.getProjectContents(ctx);
  const headings = page.content.metadata._headings || [];

  return (
    <>
      <DocsSimpleHeader>
        {page.content.metadata.title || page.project.name}
      </DocsSimpleHeader>

      <div className="flex w-full max-w-[1700px] flex-1 flex-row justify-between gap-4">
        <ClientLocaleProvider keys={['DocsNonContentRightSidebar']}>
          <DocsContentTOCSidebar headings={headings}/>
        </ClientLocaleProvider>

        <main className={`
          mt-4 min-h-[86vh] flex-1 overflow-auto px-2 pb-6 sm:mt-0 sm:min-h-[auto] sm:max-w-5xl sm:pt-4 lg:px-0 lg:pt-2
        `}
        >
          <div className="mb-6 sm:hidden">
            <DocsContentMetaSidebarBody title={t('title')} project={page.project}
                                        metadata={page.content.metadata} ctx={ctx}
                                        properties={page.properties}
            />
          </div>

          <Suspense fallback={<DocsLoadingSkeleton/>}>
            <DocsEntryPage page={page}/>
          </Suspense>

          {page.content.metadata.history &&
            <TogglableContent title={u('toggle')} className="mb-6">
                <ContentChangelog changelog={page.content.metadata.history}/>
            </TogglableContent>
          }

          {contents &&
            <ContentListFooter project={page.project} contents={contents} ctx={ctx}/>
          }
        </main>

        <DocsContentMetaSidebar title={t('title')} project={page.project}
                                metadata={page.content.metadata} ctx={ctx}
                                properties={page.properties}
        />
      </div>
    </>
  )
}