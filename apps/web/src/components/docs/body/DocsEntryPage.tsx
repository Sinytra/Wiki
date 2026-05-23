import DocsMarkdownContent from '@/components/docs/body/DocsMarkdownContent';
import TabSwitchedDocsContent from '@/components/docs/tabs/TabSwitchedDocsContent';
import DocsChangelogPage from '@/components/docs/body/DocsChangelogPage';
import DocsContentTitle from '@/components/docs/layout/DocsContentTitle';
import {RenderedDocsPage} from '@repo/shared/types/service';
import {ProjectData} from '@sinytra/wiki-api-types';

export default async function DocsEntryPage({project, page, showHistory}: {
  project: ProjectData;
  page: RenderedDocsPage;
  showHistory?: boolean
}) {
  return (
    <div className="flex min-h-[90vh] flex-col pb-20">
      <DocsContentTitle className="hidden sm:block" project={project} showHistory={showHistory}>
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
  );
}