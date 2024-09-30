import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import sources from "@/lib/docs/sources";
import ModInfo from "@/components/docs/mod-info";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import platforms from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export default async function Mod({params}: { params: { slug: string; locale: string } }) {
  setContextLocale(params.locale);

  const source = await sources.getProjectSourceOrRedirect(params.slug, params.locale);

  const project = await platforms.getPlatformProject(source.platform, source.slug);
  const isLocal = source.type === 'local';

  return (
    <ModDocsEntryPageLayout rightPanel={<ModInfo mod={project}/>}>
      <div className="flex flex-col">
        <DocsContentTitle isLocal={isLocal}>
          {project.name}
        </DocsContentTitle>

        <div>
          <MarkdownContent content={project.description} />
        </div>
      </div>
    </ModDocsEntryPageLayout>
  );
}