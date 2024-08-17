import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import sources from "@/lib/docs/sources";
import ModDocsLayout from "@/components/docs/layout/ModDocsLayout";
import ModInfo from "@/components/docs/mod-info";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import DocsTree from "@/components/docs/DocsTree";
import platforms from "@/lib/platforms";

export default async function Mod({params}: { params: { slug: string } }) {
  const source = await sources.getProjectSource(params.slug);

  const project = await platforms.getPlatformProject(source.platform, source.slug);
  const isLocal = source.type === 'local';

  return (
    <ModDocsLayout leftPanel={<DocsTree slug={project.slug}/>} rightPanel={<ModInfo mod={project}/>}>
      <div className="flex flex-col">
        <DocsContentTitle isLocal={isLocal}>
          {project.name}
        </DocsContentTitle>

        <div>
          <MarkdownContent content={project.description}/>
        </div>
      </div>
    </ModDocsLayout>
  );
}