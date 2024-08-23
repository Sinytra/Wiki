import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import sources from "@/lib/docs/sources";
import ModInfo from "@/components/docs/mod-info";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import platforms from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";

export default async function Mod({params}: { params: { slug: string } }) {
  const source = await sources.getProjectSource(params.slug);

  const project = await platforms.getPlatformProject(source.platform, source.slug);
  const isLocal = source.type === 'local';

  return (
    <ModDocsEntryPageLayout rightPanel={<ModInfo mod={project}/>}>
      <div className="flex flex-col">
        <DocsContentTitle isLocal={isLocal}>
          {project.name}
        </DocsContentTitle>
        
        <div>
          <MarkdownContent content={project.description}/>
        </div>
      </div>
    </ModDocsEntryPageLayout>
  );
}