import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/layout/DocsLayoutClient";
import {redirect} from "next/navigation";
import LeftSidebarContextProvider from "@/components/docs/side/LeftSidebarContext";
import {ErrorBoundary} from "react-error-boundary";
import DocsSidebarContextProvider from "@/components/docs/side/DocsSidebarContext";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import platforms from "@repo/platforms";
import {DEFAULT_DOCS_VERSION, LEGACY_DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import {Metadata, ResolvingMetadata} from "next";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

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
  {params}: { params: { slug: string; locale: string; version: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = (await service.getBackendLayout(params.slug, params.version, params.locale))?.project;
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project);

  return {
    title: `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${params.slug}&locale=${params.locale}`],
    }
  };
}

export default async function HomepageLayout({children, params}: LayoutProps) {
  setContextLocale(params.locale);

  const project = await service.getProject(params.slug, params.version);
  if (!project) {
    if (params.version == LEGACY_DEFAULT_DOCS_VERSION) {
      return redirect(`/${params.locale}/project/${params.slug}/${DEFAULT_DOCS_VERSION}`);
    }
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(project);

  return (
    <ErrorBoundary fallback={<DocsPageNotFoundError project={project}/>}>
      <LeftSidebarContextProvider>
        <DocsSidebarContextProvider>
          <ClientLocaleProvider keys={['DocsPageNotFoundError', 'ProjectTypes', 'ProjectCategories', 'PageEditControls', 'DocsVersionSelector', 'DocsLanguageSelect', 'LanguageSelect', 'ModVersionRange']}>
            <DocsLayoutClient project={project}
                              locale={params.locale} version={params.version}
                              platformProject={platformProject}>
              {children}
            </DocsLayoutClient>
          </ClientLocaleProvider>
        </DocsSidebarContextProvider>
      </LeftSidebarContextProvider>
    </ErrorBoundary>
  );
}
