import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/new/DocsMarkdownContent";
import {getMessages} from "next-intl/server";
import {RenderedDocsPage} from "@/lib/service";
import platforms from "@/lib/platforms";

export default async function DocsEntryPage({page, path, locale, locales, version, versions}: {
  page: RenderedDocsPage;
  path: string[];
  locale: string;
  locales?: string[];
  version: string;
  versions?: Record<string, string>;
}) {
  const project = await platforms.getPlatformProject(page.project);

  const messages = await getMessages();

  return (
    <div className="flex flex-col">
      <DocsContentTitle project={page.project} version={version}>
        {page.content.metadata.title || project.name}
      </DocsContentTitle>

      <DocsMarkdownContent>
        {page.content.content}
      </DocsMarkdownContent>
    </div>
  )
}