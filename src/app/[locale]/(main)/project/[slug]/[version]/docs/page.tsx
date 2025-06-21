import {Metadata, ResolvingMetadata} from "next";
import {setContextLocale} from "@/lib/locales/routing";
import platforms, {PlatformProject} from "@repo/platforms";
import {HOMEPAGE_FILE_PATH} from "@repo/shared/constants";
import service from "@/lib/service";
import {redirect} from "next/navigation";
import DocsMarkdownContent from "@/components/docs/body/DocsMarkdownContent";
import DocsHomepagePlaceholder from "@/components/docs/body/DocsHomepagePlaceholder";
import DocsInnerLayoutClient from "@/components/docs/layout/DocsInnerLayoutClient";
import DocsPageFooter from "@/components/docs/layout/DocsPageFooter";
import markdown, {DocumentationMarkdown} from "@repo/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsGuideNonContentRightSidebar from "@/components/docs/side/guide/DocsGuideNonContentRightSidebar";
import {getTranslations} from "next-intl/server";
import env from "@repo/shared/env";
import {Project} from "@repo/shared/types/service";

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
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url
    }
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
  const patcher = (components: Record<string, any>) => {
    return {
      ...components,
      a: ({href, ...props}: any) => {
        const Element = components['a'] || 'a';
        const ignored = href.startsWith('/') || href.includes('://');
        return <Element href={ignored ? href : 'docs/' + href} {...props} />
      }
    }
  };

  const result = await service.renderDocsPage(project.id, [HOMEPAGE_FILE_PATH], version, locale, true, patcher);
  if (result) {
    return result.content;
  }
  // File does not exist, fallback to project desc
  if (platformProject.is_placeholder) {
    return null;
  }
  try {
    const result = await markdown.renderDocumentationMarkdown(platformProject.description, patcher);
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

export default async function ProjectDocsHomepage({params}: PageProps) {
  setContextLocale(params.locale);
  const t = await getTranslations('ProjectDocsHomepage');

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);

  const content = await renderHomepage(projectData.project, platformProject, params.version, params.locale);
  const headings = content?.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={t('title')}
                           project={projectData.project}
                           tree={projectData.tree}
                           version={params.version} locale={params.locale}
                           showRightSidebar={headings.length > 0}
                           rightSidebar={<DocsGuideNonContentRightSidebar headings={headings}/>}
                           footer={<DocsPageFooter slug={params.slug} preview={isPreview}/>}
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
