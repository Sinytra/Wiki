import { PageLinks, ProjectContentContext } from '@repo/shared/types/service';
import service from '@/lib/service';
import issuesApi from '@repo/shared/api/issuesApi';

interface Props {
  text: string;
  ctx: ProjectContentContext;
  links: PageLinks;
}

export default async function MarkdownPropertyValue({ text, ctx, links }: Props) {
  try {
    const rendered = await service.renderInlineMarkdown(text, ctx, links);
    return rendered.content;
  } catch (error) {
    console.error(`Error rendering Markdown content property \`${text}\``, error);

    const project = await service.getProject(ctx);
    if (project) {
      await issuesApi.reportPageRenderFailure(project, ctx.contentId, error, ctx.version ?? null, ctx.locale ?? null);
    }

    throw error;
  }
}
