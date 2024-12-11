import { Metadata, ResolvingMetadata } from "next";
import { setContextLocale } from "@/lib/locales/routing";
import platforms, {PlatformProject} from "@/lib/platforms";
import { HOMEPAGE_FILE_PATH } from "@/lib/constants";
import service, {Project} from "@/lib/service";
import {redirect} from "next/navigation";
import DocsMarkdownContent from "@/components/docs/new/DocsMarkdownContent";
import DocsHomepagePlaceholder from "@/components/docs/DocsHomepagePlaceholder";
import MarkdownContent from "@/components/docs/markdown/MarkdownContent";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

export async function generateMetadata(
  { params }: { params: { slug: string; locale: string; version: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = (await service.getBackendLayout(params.slug, params.version, params.locale))?.project;
  if (!project) {
    return { title: (await parent).title?.absolute };
  }

  const platformProject = await platforms.getPlatformProject(project);

  return {
    title: `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}`],
    },
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url,
    },
  };
}

interface PageProps {
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

async function ProjectHomepage({project, platformProject, version, locale}: {
  project: Project;
  platformProject: PlatformProject;
  version: string;
  locale: string;
}) {
  // Attempt to resolve custom homepage
  const result = await service.renderDocsPage(project.id, [HOMEPAGE_FILE_PATH], version, locale, true);
  if (result) {
    return (
      <DocsMarkdownContent>
        {result.content.content}
      </DocsMarkdownContent>
    );
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

export default async function Homepage({ params }: PageProps) {
  // Set the locale context on the server
  setContextLocale(params.locale);

  // Fetch project data
  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);

  return (
    <ProjectHomepage project={projectData.project}
                     platformProject={platformProject} version={params.version}
                     locale={params.locale}
    />
  )
}
