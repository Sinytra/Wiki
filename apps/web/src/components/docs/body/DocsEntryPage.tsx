import DocsMarkdownContent from '@/components/docs/body/DocsMarkdownContent';
import TabSwitchedDocsContent from '@/components/docs/tabs/TabSwitchedDocsContent';
import DocsChangelogPage from '@/components/docs/body/DocsChangelogPage';
import DocsContentTitle from '@/components/docs/layout/DocsContentTitle';
import { RenderedDocsPage } from '@repo/shared/types/service';
import { ProjectData } from '@sinytra/wiki-api-types';

export default async function DocsEntryPage({
  project,
  page,
  showHistory,
  isIndexPage
}: {
  project: ProjectData;
  page: RenderedDocsPage;
  showHistory?: boolean;
  isIndexPage?: boolean;
}) {
  const mainContent = <DocsMarkdownContent>{page.content.content}</DocsMarkdownContent>;

  return (
    <div className="flex min-h-[90vh] flex-col pb-20">
      {(!isIndexPage || page.frontmatter.title != null) && (
        <DocsContentTitle className="hidden sm:block" project={project} showHistory={showHistory}>
          {page.frontmatter.title || project.name}
        </DocsContentTitle>
      )}

      {isIndexPage ? (
        mainContent
      ) : (
        <TabSwitchedDocsContent
          main={mainContent}
          history={page.frontmatter.history ? <DocsChangelogPage changelog={page.frontmatter.history} /> : null}
        />
      )}
    </div>
  );
}
