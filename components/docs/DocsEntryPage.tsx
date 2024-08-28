import sources, {RemoteDocumentationSource} from "@/lib/docs/sources";
import ModInfo from "@/components/docs/mod-info";
import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import markdown from "@/lib/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import platforms from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import PageEditControls from "@/components/docs/PageEditControls";

export default async function DocsEntryPage({slug, path}: { slug: string; path: string[] }) {
  const source = await sources.getProjectSource(slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  const file = await sources.readDocsFile(source, path);
  const result = await markdown.renderDocumentationMarkdown(file.content);
  const edit_url = source.type === 'github' || (source as RemoteDocumentationSource).editable ? file.edit_url : null;

  return (
    <ModDocsEntryPageLayout
      rightPanel={
        <div className="flex flex-col h-full">
          <DocsEntryInfo project={project} metadata={result.metadata as DocsEntryMetadata} source={source} />
          <ModInfo mod={project}/>
          {(file.updated_at != null || edit_url != null) && <PageEditControls edit_url={edit_url} updated_at={file.updated_at} />}
        </div>
      }
    >
      <div className="flex flex-col">
        <DocsContentTitle isLocal={source.type === 'local'}>
          {result.metadata.title || project.name}
        </DocsContentTitle>

        <div>
          <DocsMarkdownContent content={result.content}/>
        </div>
      </div>
    </ModDocsEntryPageLayout>
  )
}