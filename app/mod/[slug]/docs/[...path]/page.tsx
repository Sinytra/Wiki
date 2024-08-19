import sources from "@/lib/docs/sources";
import ModInfo from "@/components/docs/mod-info";
import ModDocsLayout from "@/components/docs/layout/ModDocsLayout";
import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import markdown from "@/lib/markdown";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import DocsTree from "@/components/docs/DocsTree";
import platforms from "@/lib/platforms";

export default async function ModDocsPage({params}: { params: { slug: string; path: string[] } }) {
  const source = await sources.getProjectSource(params.slug);
  const project = await platforms.getPlatformProject(source.platform, source.slug);

  const file = await sources.readDocsFile(source, params.path);
  const markdownFile = await markdown.renderDocumentationMarkdown(file);

  return (
    <ModDocsLayout
      leftPanel={<DocsTree slug={project.slug}/>}
      rightPanel={
        <div>
          <DocsEntryInfo project={project} metadata={markdownFile.metadata as DocsEntryMetadata} />
          <ModInfo mod={project}/>
        </div>
      }
    >
      <div className="flex flex-col">
        <DocsContentTitle isLocal={source.type === 'local'}>
          {markdownFile.metadata.title || 'MODID HERE'}
        </DocsContentTitle>

        <div>
          <DocsMarkdownContent htmlContent={markdownFile.content}/>
        </div>
      </div>
    </ModDocsLayout>
  )
}