import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/layout/DocsLayoutClient";
import {redirect} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import LeftSidebarContextProvider from "@/components/docs/side/LeftSidebarContext";
import {ErrorBoundary} from "react-error-boundary";
import DocsSidebarContextProvider from "@/components/docs/side/DocsSidebarContext";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import platforms from "@/lib/platforms";

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

export default async function HomepageLayout({children, params}: LayoutProps) {
  setContextLocale(params.locale);

  const messages = await getMessages();

  const project = await service.getProject(params.slug, params.version);
  if (!project) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(project);

  return (
    <ErrorBoundary fallback={<DocsPageNotFoundError project={project}/>}>
      <NuqsAdapter>
        <LeftSidebarContextProvider>
          <DocsSidebarContextProvider>
            <NextIntlClientProvider
              messages={pick(messages, 'DocsPageNotFoundError', 'ProjectTypes', 'ProjectCategories', 'PageEditControls', 'DocsVersionSelector', 'DocsLanguageSelect', 'ModVersionRange')}>
              <DocsLayoutClient title={project.name} project={project}
                                platformProject={platformProject}>
                {children}
              </DocsLayoutClient>
            </NextIntlClientProvider>
          </DocsSidebarContextProvider>
        </LeftSidebarContextProvider>
      </NuqsAdapter>
    </ErrorBoundary>
  );
}
