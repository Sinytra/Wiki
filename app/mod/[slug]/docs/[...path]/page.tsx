import sources from "@/lib/docs/sources";
import DocsMarkdownContent from "@/components/docs/docs-markdown-content";
import ContentTitle from "@/components/docs/content-title";
import markdown from "@/lib/markdown";
import DocsTree from "@/components/docs/docs-tree";
import ModInfo from "@/components/docs/mod-info";
import ModDocsLayout from "@/components/docs/ModDocsLayout";
import modrinth from "@/lib/modrinth";
import DocsEntryInfo from "@/components/docs/DocsEntryInfo";
import {DocsEntryMetadata} from "@/lib/docs/metadata";

export default async function ModDocsPage({params}: { params: { slug: string; path: string[] } }) {
  const project = await modrinth.getProject(params.slug);
  const source = await sources.getProjectSource(params.slug);

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
        <ContentTitle isLocal={source.type === 'local'}>
          {markdownFile.metadata.title || 'MODID HERE'}
        </ContentTitle>

        <div>
          <DocsMarkdownContent htmlContent={markdownFile.content}/>
        </div>
      </div>
    </ModDocsLayout>
  )
}