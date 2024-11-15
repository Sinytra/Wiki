import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import PageEditControls from "@/components/docs/PageEditControls";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import {RenderedDocsPage} from "@/lib/service";
import platforms from "@/lib/platforms";

export default async function DocsEntryPage({page, path, version}: { page: RenderedDocsPage; path: string[]; version: string }) {
  const project = await platforms.getPlatformProject(page.mod.platform, page.mod.slug);

  const messages = await getMessages();

  return (
    <ModDocsEntryPageLayout
      rightPanel={
        <div className="flex flex-col h-full">
          {!page.content.metadata.hide_meta && <DocsEntryInfo mod={page.mod} project={project} metadata={page.content.metadata as DocsEntryMetadata} version={version} />}
          {page.content.metadata.hide_meta && page.content.metadata._headings &&
            <NextIntlClientProvider messages={pick(messages, 'DocsTableOfContents')}>
                <DocsTableOfContents headings={page.content.metadata._headings}/>
            </NextIntlClientProvider>
          }
          {<PageEditControls edit_url={page.edit_url} updated_at={page.updated_at} slug={page.mod.id} path={path} />}
        </div>
      }
    >
      <div className="flex flex-col">
        <DocsContentTitle mod={page.mod} version={version}>
          {page.content.metadata.title || project.name}
        </DocsContentTitle>

        <DocsMarkdownContent content={page.content.content}/>
      </div>
    </ModDocsEntryPageLayout>
  )
}