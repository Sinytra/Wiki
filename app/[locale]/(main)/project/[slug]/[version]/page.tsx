import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import ProjectInfo from "@/components/docs/project-info";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {PlatformProject} from "@/lib/platforms";
import ProjectDocsEntryPageLayout from "@/components/docs/layout/ProjectDocsEntryPageLayout";
import {setContextLocale} from "@/lib/locales/routing";
import DocsHomepagePlaceholder from "@/components/docs/DocsHomepagePlaceholder";
import {HOMEPAGE_FILE_PATH} from "@/lib/constants";
import DocsMarkdownContent from "@/components/docs/markdown/DocsMarkdownContent";
import {Metadata, ResolvingMetadata} from "next";
import service, {type Project} from "@/lib/service";
import {redirect} from "next/navigation";
import platforms from "@/lib/platforms";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata({params}: { params: { slug: string; locale: string; version: string } },
                                       parent: ResolvingMetadata): Promise<Metadata> {
  const project = (await service.getBackendLayout(params.slug, params.version, params.locale))?.project;
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project.platform, project.slug);

  return {
    title: `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}`]
    },
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url
    }
  }
}

async function ProjectHomepage({project, platformProject, version, locale}: {
  project: Project;
  platformProject: PlatformProject;
  version: string;
  locale: string;
}) {
  // Attempt to resolve custom homepage
  const result = await service.renderDocsPage(project.id, [HOMEPAGE_FILE_PATH], version, locale);
  if (result) {
    return <DocsMarkdownContent content={result.content.content}/>;
  }

  // File does not exist, fallback to project desc
  return (
      platformProject.is_placeholder
          ?
          <DocsHomepagePlaceholder/>
          :
          <div>
            <MarkdownContent content={platformProject.description}/>
          </div>
  );
}

export default async function Homepage({params}: { params: { slug: string; version: string; locale: string } }) {
  setContextLocale(params.locale);

  const data = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!data) redirect('/');

  const platformProject = await platforms.getPlatformProject(data.project.platform, data.project.slug);

  return (
      <ProjectDocsEntryPageLayout rightPanel={<ProjectInfo project={platformProject}/>}>
        <div className="flex flex-col">
          <DocsContentTitle project={data.project} version={params.version}>
            {platformProject.name}
          </DocsContentTitle>

          <ProjectHomepage project={data.project} platformProject={platformProject} version={params.version}
                           locale={params.locale}/>
        </div>
      </ProjectDocsEntryPageLayout>
  );
}
