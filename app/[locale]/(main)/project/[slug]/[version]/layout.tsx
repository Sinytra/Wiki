// /app/homepage/layout.tsx

import { ReactNode } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { setContextLocale } from "@/lib/locales/routing";
import platforms from "@/lib/platforms";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/new/DocsLayoutClient";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

interface LayoutProps {
  children: ReactNode;
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

export async function generateMetadata(
  { params }: LayoutProps,
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

export default async function HomepageLayout({ children, params }: LayoutProps) {
  // Set the locale context on the server
  setContextLocale(params.locale);

  // Fetch project data
  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    // Handle redirection or error rendering
    return <div>Project not found</div>;
    // Alternatively, use Next.js redirection:
    // import { redirect } from 'next/navigation';
    // redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(projectData.project);

  // Attempt to resolve custom homepage content
  const result = await service.renderDocsPage(
    projectData.project.id,
    [service.HOMEPAGE_FILE_PATH],
    params.version,
    params.locale,
    true
  );

  const homepageContent = result ? result.content.content : null;

  return (
    <DocsLayoutClient
      project={projectData.project}
      platformProject={platformProject}
      version={params.version}
      locale={params.locale}
      homepageContent={homepageContent}
    >
      {children}
    </DocsLayoutClient>
  );
}
