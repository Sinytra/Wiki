import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/body/DocsMarkdownContent";
import {RenderedDocsPage} from "@/lib/service";
import platforms from "@/lib/platforms";
import TabSwitchedDocsContent from "@/components/docs/tabs/TabSwitchedDocsContent";
import DocsChangelogPage from "@/components/docs/body/DocsChangelogPage";

export default async function DocsEntryPage({page}: { page: RenderedDocsPage; }) {
  const project = await platforms.getPlatformProject(page.project);

  return (
    <div className="flex flex-col">
      <DocsContentTitle project={page.project}>
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