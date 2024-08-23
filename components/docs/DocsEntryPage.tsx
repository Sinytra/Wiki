import sources from "@/lib/docs/sources";
import ModInfo from "@/components/docs/mod-info";
import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import markdown from "@/lib/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import platforms from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";

export default async function DocsEntryPage({slug, path}: { slug: string; path: string[] }) {
  const source = await sources.getProjectSource(slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  const file = await sources.readDocsFile(source, path);
  const result = await markdown.renderDocumentationMarkdown(file);

  return (
    <ModDocsEntryPageLayout
      rightPanel={
        <div>
          <DocsEntryInfo project={project} metadata={result.metadata as DocsEntryMetadata} />
          <ModInfo mod={project}/>
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