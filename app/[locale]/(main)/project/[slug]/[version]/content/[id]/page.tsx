import {setContextLocale} from "@/lib/locales/routing";
import service, {RenderedDocsPage} from "@/lib/service";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import {redirect} from "next/navigation";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import {Suspense} from "react";
import {getTranslations} from "next-intl/server";
import DocsContentTOCSidebar from "@/components/docs/side/content/DocsContentTOCSidebar";
import ContentListFooter from "@/components/docs/ContentListFooter";
import ProjectDocsMobileHeader from "@/components/docs/ProjectDocsMobileHeader";
import DocsContentMetaSidebar from "@/components/docs/side/content/DocsContentMetaSidebar";
import {Metadata, ResolvingMetadata} from "next";
import platforms from "@/lib/platforms";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

interface Props {
  params: {
    slug: string;
    version: string;
    locale: string;
    id: string;
  };
}

export async function generateMetadata({params}: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const page = await service.getProjectContentPage(params.slug, params.id, params.version, params.locale);
  if (!page) {
    return {title: (await parent).title?.absolute};
  }

  const project = await platforms.getPlatformProject(page.project);
  const result = matter(page.content).data as DocsEntryMetadata;

  return {
    title: result.title ? `${result.title} - ${project.name}` : `${project.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}&id=${params.id}`]
    }
  }
}

export default async function ContentEntryPage({params}: Props) {
  setContextLocale(params.locale);
  const id = decodeURIComponent(params.id);

  let page: RenderedDocsPage | null;
  try {
    page = await service.renderProjectContentPage(params.slug, id, params.version, params.locale);
  } catch (e) {
    console.error('FATAL error rendering content page', e);
    return (
      <DocsPageNotFoundError/>
    );
  }
  if (!page) redirect(`/project/${params.slug}/${params.version}/content`);

  const t = await getTranslations('DocsContentRightSidebar');

  const contents = await service.getProjectContents(params.slug, params.version, params.locale);
  const headings = page.content.metadata._headings || [];

  return (
    <>
      <ProjectDocsMobileHeader showRightSidebar={headings.length > 0}>
        {page.content.metadata.title || page.project.name}
      </ProjectDocsMobileHeader>

      <div className="flex w-full max-w-[1632px] flex-1 flex-row justify-between gap-4">
        <ClientLocaleProvider keys={['DocsNonContentRightSidebar']}>
          <DocsContentTOCSidebar headings={headings}/>
        </ClientLocaleProvider>

        <main className={`
          mt-4 min-h-[86vh] flex-1 overflow-auto px-2 pb-6 sm:mt-0 sm:min-h-[auto] sm:max-w-5xl sm:pt-4 lg:px-0 lg:pt-2
        `}
        >
          <Suspense fallback={<DocsLoadingSkeleton/>}>
            <DocsEntryPage page={page}/>
          </Suspense>

          {contents && <ContentListFooter project={page.project} contents={contents} version={params.version}/>}
        </main>

        <DocsContentMetaSidebar title={t('title')} project={page.project}
                                metadata={page.content.metadata}
                                version={params.version}/>
      </div>
    </>
  )
}