import { Metadata, ResolvingMetadata } from "next";
import { setContextLocale } from "@/lib/locales/routing";
import platforms from "@/lib/platforms";
import DocsLayoutClient from "@/components/docs/new/DocsLayoutClient"
import { HOMEPAGE_FILE_PATH } from "@/lib/constants";
import service from "@/lib/service";

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

export default async function Homepage({ params }: PageProps) {
  // Set the locale context on the server
  setContextLocale(params.locale);

  // Fetch project data
  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    // Handle redirection or error rendering
    return <div>Project not found</div>;
    // Or use Next.js redirection:
    // import { redirect } from 'next/navigation';
    // redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);

  // Attempt to resolve custom homepage content
  const result = await service.renderDocsPage(
    projectData.project.id,
    [HOMEPAGE_FILE_PATH],
    params.version,
    params.locale,
    true
  );

  const homepageContent = result ? result.content.content : null;

  return homepageContent;
}
