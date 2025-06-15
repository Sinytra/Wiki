import DocsMarkdownContent from "@/components/docs/body/DocsMarkdownContent";
import platforms from "@repo/platforms";
import TabSwitchedDocsContent from "@/components/docs/tabs/TabSwitchedDocsContent";
import DocsChangelogPage from "@/components/docs/body/DocsChangelogPage";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {RenderedDocsPage} from "@repo/shared/types/service";

export default async function DocsEntryPage({page, showHistory}: { page: RenderedDocsPage; showHistory?: boolean }) {
  const project = await platforms.getPlatformProject(page.project);

  return (
    <div className="flex min-h-[90vh] flex-col pb-20">
      <DocsContentTitle className="hidden sm:block" project={page.project} showHistory={showHistory}>
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