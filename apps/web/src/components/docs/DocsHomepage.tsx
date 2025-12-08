import service from "@/lib/service";
import {HOMEPAGE_FILE_PATH} from "@repo/shared/constants";
import DocsMarkdownContent from "@/components/docs/body/DocsMarkdownContent";
import issuesApi from "@repo/shared/api/issuesApi";
import markdown, {DocsEntryMetadata} from "@repo/markdown";
import {RenderedMarkdownContent} from "@/components/docs/body/MarkdownContent";
import {Project, ProjectContext} from "@repo/shared/types/service";
import {PlatformProject} from "@repo/shared/platforms";
import {ReactNode} from "react";

interface Props {
  project: Project;
  platformProject: PlatformProject;
  ctx: ProjectContext;

  placeholder?: ReactNode;
  errorPlaceholder?: ReactNode;
  wrapper: (content: ReactNode) => ReactNode;
}

interface RenderedHomepage {
  content: ReactNode;
  metadata: DocsEntryMetadata;
}

export async function renderHomepage(project: Project, platformProject: PlatformProject, ctx: ProjectContext): Promise<RenderedHomepage | null | undefined> {
  try {
    const result = await service.renderDocsPage([HOMEPAGE_FILE_PATH], true, ctx);
    if (result) {
      const content = (
        <DocsMarkdownContent>
          {result.content.content}
        </DocsMarkdownContent>
      );
      return {content, metadata: result.content.metadata};
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
    const htmlContent = await markdown.renderMarkdown(platformProject.description);
    const content = (
      <RenderedMarkdownContent htmlContent={htmlContent}/>
    );
    return {content, metadata: {}}
  } catch (e) {
    console.error('Error rendering homepage', e);
    return undefined;
  }
}

export async function RenderedDocsHomepage({content, placeholder, errorPlaceholder}: {
  content?: RenderedHomepage | null;
  placeholder?: ReactNode;
  errorPlaceholder?: ReactNode;
}) {
  return content === undefined ? errorPlaceholder
    : content == null ? placeholder
      : content.content;
}

export default async function DocsHomepage({
                                             project,
                                             platformProject,
                                             ctx,
                                             placeholder,
                                             errorPlaceholder,
                                             wrapper
                                           }: Props) {
  const content = await renderHomepage(project, platformProject, ctx);
  return content === undefined ? errorPlaceholder
    : content == null ? placeholder
      : (wrapper?.(content.content) ?? content.content)
}