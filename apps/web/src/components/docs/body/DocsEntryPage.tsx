import DocsMarkdownContent from '@/components/docs/body/DocsMarkdownContent';
import TabSwitchedDocsContent from '@/components/docs/tabs/TabSwitchedDocsContent';
import DocsChangelogPage from '@/components/docs/body/DocsChangelogPage';
import DocsContentTitle from '@/components/docs/layout/DocsContentTitle';
import { RenderedDocsPage } from '@repo/shared/types/service';
import { ProjectData } from '@sinytra/wiki-api-types';
import { ReactNode } from 'react';

interface Props {
  project: ProjectData;
  page: RenderedDocsPage;
  rightSidebar?: ReactNode;
  showHistory?: boolean;
  isIndexPage?: boolean;
}

export default async function DocsEntryPage({ project, page, showHistory, isIndexPage, rightSidebar }: Props) {
  const mainContent = (
    <DocsMarkdownContent>
      {rightSidebar}
      {page.content.content}
    </DocsMarkdownContent>
  );

  return (
    <div className="flex min-h-[90vh] flex-col pb-20">
      {(!isIndexPage || page.frontmatter.title != null) && (
        <DocsContentTitle className="" project={project} showHistory={showHistory}>
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
