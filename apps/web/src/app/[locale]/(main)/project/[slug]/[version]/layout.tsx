import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/layout/DocsLayoutClient";
import {notFound, redirect} from "next/navigation";
import LeftSidebarContextProvider from "@/components/docs/side/LeftSidebarContext";
import {ErrorBoundary} from "react-error-boundary";
import DocsSidebarContextProvider from "@/components/docs/side/DocsSidebarContext";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import platforms from "@repo/shared/platforms";
import {Metadata, ResolvingMetadata} from "next";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export const dynamic = 'force-static';
export const fetchCache = 'default-cache';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
  }>;
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string; locale: string; version: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {slug, version, locale} = await props.params;
  const project = await service.getProject({id: slug, version, locale});
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project);

  return {
    title: `${platformProject.name} - ${(await parent).title?.absolute}`,
    openGraph: {
      images: [`/api/og?slug=${slug}&locale=${locale}`],
    }
  };
}

export default async function HomepageLayout(props: LayoutProps) {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  const {children} = props;
  setContextLocale(locale);

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  const platformProject = await platforms.getPlatformProject(project);

  return (
    <ErrorBoundary fallback={<DocsPageNotFoundError project={project}/>}>
      <LeftSidebarContextProvider>
        <DocsSidebarContextProvider>
          <ClientLocaleProvider keys={['DocsPageNotFoundError', 'ProjectTypes', 'ProjectCategories', 'PageEditControls', 'DocsVersionSelector', 'LanguageSelect', 'ModVersionRange']}>
            <DocsLayoutClient project={project}
                              locale={locale} version={version}
                              platformProject={platformProject}>
              {children}
            </DocsLayoutClient>
          </ClientLocaleProvider>
        </DocsSidebarContextProvider>
      </LeftSidebarContextProvider>
    </ErrorBoundary>
  );
}
