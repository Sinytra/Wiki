import sources, {RemoteDocumentationSource} from "@/lib/docs/sources";
import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import markdown from "@/lib/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import platforms from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import PageEditControls from "@/components/docs/PageEditControls";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";

export default async function DocsEntryPage({slug, path, locale}: { slug: string; path: string[]; locale: string }) {
  const source = await sources.getProjectSource(slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  const file = await sources.readDocsFile(source, path, locale);
  const result = await markdown.renderDocumentationMarkdown(file.content);
  const edit_url = source.type === 'github' && (source as RemoteDocumentationSource).editable ? file.edit_url : null;

  const messages = await getMessages();

  return (
    <ModDocsEntryPageLayout
      rightPanel={
        <div className="flex flex-col h-full">
          {!result.metadata.hide_meta && <DocsEntryInfo project={project} metadata={result.metadata as DocsEntryMetadata} source={source} />}
          {result.metadata.hide_meta && result.metadata._headings &&
            <NextIntlClientProvider messages={pick(messages, 'DocsTableOfContents')}>
                <DocsTableOfContents headings={result.metadata._headings}/>
            </NextIntlClientProvider>
          }
          {(file.updated_at != null || edit_url != null) && <PageEditControls edit_url={edit_url} updated_at={file.updated_at} slug={slug} path={path} />}
        </div>
      }
    >
      <div className="flex flex-col">
        <DocsContentTitle isLocal={source.type === 'local'} isCommunity={source.is_community}>
          {result.metadata.title || project.name}
        </DocsContentTitle>

        <div>
          <DocsMarkdownContent content={result.content}/>
        </div>
      </div>
    </ModDocsEntryPageLayout>
  )
}