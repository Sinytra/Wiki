import service from '@/lib/service';
import issuesApi from '@repo/shared/api/issuesApi';
import markdown, { DocsEntryMetadata } from '@repo/markdown';
import { RenderedMarkdownContent } from '@/components/docs/body/MarkdownContent';
import { ProjectContext } from '@repo/shared/types/service';
import { ProjectData } from '@sinytra/wiki-api-types';
import { PlatformProject } from '@repo/shared/platforms';
import { ReactNode } from 'react';
import DocsEntryPage from '@/components/docs/body/DocsEntryPage';

interface Props {
  project: ProjectData;
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

export async function renderHomepage(
  project: ProjectData,
  platformProject: PlatformProject,
  ctx: ProjectContext
): Promise<RenderedHomepage | null | undefined> {
  try {
    const result = await service.renderDocsIndexPage(ctx);
    if (result) {
      const content = <DocsEntryPage project={project} page={result} isIndexPage />;
      return { content, metadata: result.content.metadata };
    }
  } catch (err) {
    console.error('Error rendering homepage!', err);

    await issuesApi.reportPageRenderFailure(project, '(docs index page)', err, ctx.version ?? null, ctx.locale ?? null);
  }
  // File does not exist, fallback to project desc
  if (platformProject.is_placeholder) {
    return null;
  }
  try {
    const htmlContent = await markdown.renderMarkdown(platformProject.description);
    const content = <RenderedMarkdownContent htmlContent={htmlContent} />;
    return { content, metadata: {} };
  } catch (e) {
    console.error('Error rendering homepage', e);
    return undefined;
  }
}

export async function RenderedDocsHomepage({
  content,
  placeholder,
  errorPlaceholder
}: {
  content?: RenderedHomepage | null;
  placeholder?: ReactNode;
  errorPlaceholder?: ReactNode;
}) {
  return content === undefined ? errorPlaceholder : content == null ? placeholder : content.content;
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
  return content === undefined
    ? errorPlaceholder
    : content == null
      ? placeholder
      : (wrapper?.(content.content) ?? content.content);
}
