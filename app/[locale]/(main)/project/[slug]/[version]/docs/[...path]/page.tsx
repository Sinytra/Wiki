import {Suspense} from "react";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import {Metadata, ResolvingMetadata} from "next";
import {setContextLocale} from "@/lib/locales/routing";
import service, {RenderedDocsPage} from "@/lib/service";
import {redirect} from "next/navigation";
import matter from "gray-matter";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import platforms from "@/lib/platforms";
import DocsInnerLayoutClient from "@/components/docs/layout/DocsInnerLayoutClient";
import DocsPageFooter from "@/components/docs/layout/DocsPageFooter";
import DocsNonContentRightSidebar from "@/components/docs/side/DocsNonContentRightSidebar";
import DocsContentRightSidebar from "@/components/docs/side/DocsContentRightSidebar";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";

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
    return (
      <DocsPageNotFoundError repo={projectData.project.is_public ? projectData.project.source_repo : undefined}/>
    );
  }
  if (!page) redirect(`/project/${params.slug}/docs`);

  const messages = await getMessages();
  const isContentPage = (page.content.metadata.id !== undefined || page.content.metadata.icon !== undefined)
    && page.content.metadata.hide_meta === undefined;

  return (
    <DocsInnerLayoutClient project={page.project}
                           tree={projectData.tree}
                           version={params.version} locale={params.locale}
                           rightSidebar={
                             isContentPage
                               ? <DocsContentRightSidebar project={projectData.project}
                                                          metadata={page.content.metadata}
                                                          version={params.version}/>
                               : <NextIntlClientProvider messages={pick(messages, 'DocsNonContentRightSidebar')}>
                                 <DocsNonContentRightSidebar headings={page.content.metadata._headings || []}/>
                               </NextIntlClientProvider>
                           }
                           footer={
                             <DocsPageFooter locale={params.locale} locales={projectData.project.locales}
                                             version={params.version} versions={projectData.project.versions}
                                             editUrl={page.edit_url} updatedAt={page.updated_at}
                                             showHistory={page.content.metadata.history !== undefined}
                                             slug={params.slug} path={params.path}
                                             local={projectData.project.local}
                             />
                           }
    >
      <Suspense fallback={<DocsLoadingSkeleton/>}>
        <DocsEntryPage page={page}/>
      </Suspense>
    </DocsInnerLayoutClient>
  )
}