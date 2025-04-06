import {Metadata, ResolvingMetadata} from "next";
import {setContextLocale} from "@/lib/locales/routing";
import platforms, {PlatformProject} from "@/lib/platforms";
import {HOMEPAGE_FILE_PATH} from "@/lib/constants";
import service, {Project} from "@/lib/service";
import {redirect} from "next/navigation";
import DocsMarkdownContent from "@/components/docs/body/DocsMarkdownContent";
import DocsHomepagePlaceholder from "@/components/docs/body/DocsHomepagePlaceholder";
import DocsInnerLayoutClient from "@/components/docs/layout/DocsInnerLayoutClient";
import DocsPageFooter from "@/components/docs/layout/DocsPageFooter";
import {pick} from "lodash";
import DocsNonContentRightSidebar from "@/components/docs/side/DocsNonContentRightSidebar";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import markdown, {DocumentationMarkdown} from "@/lib/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata(
  {params}: { params: { slug: string; locale: string; version: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = (await service.getBackendLayout(params.slug, params.version, params.locale))?.project;
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project);

  return {
    title: `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}`],
    },
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url,
    },
  };
}

interface PageProps {
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

async function renderHomepage(project: Project, platformProject: PlatformProject, version: string, locale: string): Promise<DocumentationMarkdown | null | undefined> {
  const result = await service.renderDocsPage(project.id, [HOMEPAGE_FILE_PATH], version, locale, true);
  if (result) {
    return result.content;
  }
  // File does not exist, fallback to project desc
  if (platformProject.is_placeholder) {
    return null;
  }
  try {
    const result = await markdown.renderDocumentationMarkdown(platformProject.description);
    return {
      ...result, content: (
        <div className="[&>_:first-child>*]:mt-0!">
          {result.content}
        </div>
      )
    }
  } catch (e) {
    console.error('Error rendering homepage', e);
    return undefined;
  }
}

export default async function Homepage({params}: PageProps) {
  setContextLocale(params.locale);

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);
  const messages = await getMessages();

  const content = await renderHomepage(projectData.project, platformProject, params.version, params.locale);

  return (
    <DocsInnerLayoutClient title="Home"
                           project={projectData.project}
                           tree={projectData.tree}
                           version={params.version} locale={params.locale}
                           rightSidebar={
                             <NextIntlClientProvider messages={pick(messages, 'DocsNonContentRightSidebar')}>
                               <DocsNonContentRightSidebar headings={content?.metadata._headings || []}/>
                             </NextIntlClientProvider>
                           }
                           footer={
                             <DocsPageFooter/>
                           }
    >
      {content === undefined ?
        <DocsContentTitle>
          {platformProject.name}
        </DocsContentTitle>
        : content === null
          ?
          <DocsHomepagePlaceholder/>
          :
          <DocsMarkdownContent>
            {content.content}
          </DocsMarkdownContent>
      }
    </DocsInnerLayoutClient>
  )
}
