import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/new/DocsMarkdownContent";
import {RenderedDocsPage} from "@/lib/service";
import platforms from "@/lib/platforms";
import TabSwitchedDocsContent from "@/components/docs/new/tabs/TabSwitchedDocsContent";
import DocsChangelogPage from "@/components/docs/new/DocsChangelogPage";

export default async function DocsEntryPage({page, version}: { page: RenderedDocsPage; version: string; }) {
  const project = await platforms.getPlatformProject(page.project);

  return (
    <div className="flex flex-col">
      <DocsContentTitle project={page.project} version={version}>
        {page.content.metadata.title || project.name}
      </DocsContentTitle>

      <TabSwitchedDocsContent
        main={
          <DocsMarkdownContent>
            {page.content.content}
          </DocsMarkdownContent>
        }
        history={
          page.content.metadata.history ? <DocsChangelogPage changelog={page.content.metadata.history}/> : null
        }
      />
    </div>
  )
}