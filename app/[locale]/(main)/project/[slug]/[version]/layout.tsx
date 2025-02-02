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

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }

  return (
    <ErrorBoundary fallback={<DocsPageNotFoundError repo={projectData.project.is_public ? projectData.project.source_repo : undefined}/>}>
      <NuqsAdapter>
        <LeftSidebarContextProvider>
          <DocsSidebarContextProvider>
            <NextIntlClientProvider messages={pick(messages, 'ProjectTypes', 'ProjectCategories', 'PageEditControls', 'DocsVersionSelector', 'DocsLanguageSelect', 'ModVersionRange')}>
              <DocsLayoutClient title={projectData.project.name}>
                {children}
              </DocsLayoutClient>
            </NextIntlClientProvider>
          </DocsSidebarContextProvider>
        </LeftSidebarContextProvider>
      </NuqsAdapter>
    </ErrorBoundary>
  );
}
