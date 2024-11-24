import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import ModInfo from "@/components/docs/mod-info";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {ModProject} from "@/lib/platforms";
import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import {setContextLocale} from "@/lib/locales/routing";
import DocsHomepagePlaceholder from "@/components/docs/DocsHomepagePlaceholder";
import {HOMEPAGE_FILE_PATH} from "@/lib/constants";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import {Metadata, ResolvingMetadata} from "next";
import service, {type Mod} from "@/lib/service";
import {redirect} from "next/navigation";
import platforms from "@/lib/platforms";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata({params}: { params: { slug: string; locale: string; version: string } },
                                       parent: ResolvingMetadata): Promise<Metadata> {
  const mod = (await service.getBackendLayout(params.slug, params.version, params.locale))?.project;
  if (!mod) {
    return {title: (await parent).title?.absolute};
  }

  const project = await platforms.getPlatformProject(mod.platform, mod.slug);

  return {
    title: `${project.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}`]
    },
    other: {
      docs_source_mod: project.name,
      docs_source_icon: project.icon_url
    }
  }
}

async function ModHomepage({mod, project, version, locale}: {
  mod: Mod;
  project: ModProject;
  version: string;
  locale: string;
}) {
  // Attempt to resolve custom homepage
  const result = await service.renderDocsPage(mod.id, [HOMEPAGE_FILE_PATH], version, locale);
  if (result) {
    return <DocsMarkdownContent content={result.content.content}/>;
  }

  // File does not exist, fallback to project desc
  return (
    project.is_placeholder
      ?
      <DocsHomepagePlaceholder/>
      :
      <div>
        <MarkdownContent content={project.description}/>
      </div>
  );
}

export default async function ProjectHomepage({params}: { params: { slug: string; version: string; locale: string } }) {
  setContextLocale(params.locale);

  const data = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!data) redirect('/');

  const project = await platforms.getPlatformProject(data.project.platform, data.project.slug);

  return (
    <ModDocsEntryPageLayout rightPanel={<ModInfo mod={project}/>}>
      <div className="flex flex-col">
        <DocsContentTitle mod={data.project} version={params.version}>
          {project.name}
        </DocsContentTitle>

        <ModHomepage mod={data.project} project={project} version={params.version} locale={params.locale}/>
      </div>
    </ModDocsEntryPageLayout>
  );
}
