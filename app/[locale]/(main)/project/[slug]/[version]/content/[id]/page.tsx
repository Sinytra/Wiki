import {setContextLocale} from "@/lib/locales/routing";
import service, {RenderedDocsPage} from "@/lib/service";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import {redirect} from "next/navigation";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import {Suspense} from "react";
import {getMessages, getTranslations} from "next-intl/server";
import DocsContentTOCSidebar from "@/components/docs/side/content/DocsContentTOCSidebar";
import {pick} from "lodash";
import {NextIntlClientProvider} from "next-intl";
import ContentListFooter from "@/components/docs/ContentListFooter";
import ProjectDocsMobileHeader from "@/components/docs/ProjectDocsMobileHeader";
import DocsContentMetaSidebar from "@/components/docs/side/content/DocsContentMetaSidebar";

interface Props {
  params: {
    slug: string;
    version: string;
    locale: string;
    id: string;
  };
}

export default async function ContentEntryPage({params}: Props) {
  setContextLocale(params.locale);
  const id = decodeURIComponent(params.id);

  let page: RenderedDocsPage | null;
  try {
    // TODO version and locale
    page = await service.renderProjectContentPage(params.slug, id);
  } catch (e) {
    console.error('FATAL error rendering content page', e);
    return (
      <DocsPageNotFoundError/>
    );
  }
  if (!page) redirect(`/project/${params.slug}/${params.version}/content`);

  const t = await getTranslations('DocsContentRightSidebar');
  const messages = await getMessages();

  const contents = await service.getProjectContents(params.slug);
  const headings = page.content.metadata._headings || [];

  return (
    <>
      <ProjectDocsMobileHeader showRightSidebar={headings.length > 0}>
        {page.content.metadata.title || page.project.name}
      </ProjectDocsMobileHeader>

      <div className="flex flex-row flex-1 justify-between gap-4 w-full max-w-[1632px]">
        <NextIntlClientProvider messages={pick(messages, 'DocsNonContentRightSidebar')}>
          <DocsContentTOCSidebar headings={headings}/>
        </NextIntlClientProvider>

        <main className="flex-1 overflow-auto
                       mt-4 sm:mt-0
                       pb-6 sm:pt-4 lg:pt-2 px-2 lg:px-0
                       min-h-[86vh] sm:min-h-[auto] sm:max-w-5xl"
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