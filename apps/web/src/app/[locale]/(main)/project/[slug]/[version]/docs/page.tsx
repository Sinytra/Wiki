import {setContextLocale} from "@/lib/locales/routing";
import platforms, {PlatformProject} from "@repo/shared/platforms";
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
import {Project, ProjectContext} from "@repo/shared/types/service";
import issuesApi from "@repo/shared/api/issuesApi";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

interface PageProps {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
  }>;
}

async function renderHomepage(project: Project, platformProject: PlatformProject, ctx: ProjectContext): Promise<DocumentationMarkdown | null | undefined> {
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

  try {
    const result = await service.renderDocsPage([HOMEPAGE_FILE_PATH], true, ctx, patcher);
    if (result) {
      return result.content;
    }
  } catch (err) {
    console.error('Error rendering homepage!', err);

    await issuesApi.reportPageRenderFailure(project, HOMEPAGE_FILE_PATH, err, ctx.version ?? null, ctx.locale ?? null);
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

export default async function ProjectDocsHomepage(props: PageProps) {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);
  const t = await getTranslations('ProjectDocsHomepage');

  const projectData = await service.getBackendLayout(ctx);
  if (!projectData) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);

  const content = await renderHomepage(projectData.project, platformProject, ctx);
  const headings = content?.metadata._headings || [];
  const isPreview = env.isPreview();

  return (
    <DocsInnerLayoutClient title={t('title')}
                           project={projectData.project}
                           tree={projectData.tree}
                           version={version} locale={locale}
                           showRightSidebar={headings.length > 0}
                           rightSidebar={<DocsGuideNonContentRightSidebar headings={headings}/>}
                           footer={<DocsPageFooter slug={slug} preview={isPreview}/>}
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
