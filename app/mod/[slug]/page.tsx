import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import sources from "@/lib/docs/sources";
import ContentTitle from "@/components/docs/content-title";
import ModDocsLayout from "@/components/docs/ModDocsLayout";
import DocsTree from "@/components/docs/docs-tree";
import ModInfo from "@/components/docs/mod-info";

export default async function Mod({params}: { params: { slug: string } }) {
  const project = await modrinth.getProject(params.slug);
  const isLocal = await sources.isLocalSource(project.slug);

  return (
    <ModDocsLayout leftPanel={<DocsTree slug={project.slug}/>} rightPanel={<ModInfo mod={project}/>}>
      <div className="flex flex-col">
        <ContentTitle isLocal={isLocal}>
          {project.name}
        </ContentTitle>

        <div>
          <MarkdownContent content={project.description}/>
        </div>
      </div>
    </ModDocsLayout>
  );
}