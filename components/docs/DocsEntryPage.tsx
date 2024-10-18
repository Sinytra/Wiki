import sources from "@/lib/docs/sources";
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

export default async function DocsEntryPage({slug, path, locale, version}: { slug: string; path: string[]; locale: string; version: string }) {
  const source = await sources.getBranchedProjectSource(slug, version);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  const {file, content, edit_url} = await markdown.renderDocumentationFile(source, path, locale);

  const messages = await getMessages();

  return (
    <ModDocsEntryPageLayout
      rightPanel={
        <div className="flex flex-col h-full">
          {!content.metadata.hide_meta && <DocsEntryInfo project={project} metadata={content.metadata as DocsEntryMetadata} source={source} />}
          {content.metadata.hide_meta && content.metadata._headings &&
            <NextIntlClientProvider messages={pick(messages, 'DocsTableOfContents')}>
                <DocsTableOfContents headings={content.metadata._headings}/>
            </NextIntlClientProvider>
          }
          {(file.updated_at != null || edit_url != null) && <PageEditControls edit_url={edit_url} updated_at={file.updated_at} slug={slug} path={path} />}
        </div>
      }
    >
      <div className="flex flex-col">
        <DocsContentTitle source={source} version={version}>
          {content.metadata.title || project.name}
        </DocsContentTitle>

        <DocsMarkdownContent content={content.content}/>
      </div>
    </ModDocsEntryPageLayout>
  )
}