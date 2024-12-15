import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/new/DocsLayoutClient";
import {redirect} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import RightSidebarContextProvider from "@/components/docs/new/side/RightSidebarContext";
import LeftSidebarContextProvider from "@/components/docs/new/side/LeftSidebarContext";

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

  // TODO Where is DocsPageNotFoundError?
  return (
    <NuqsAdapter>
      <LeftSidebarContextProvider>
        <RightSidebarContextProvider>
          <NextIntlClientProvider messages={pick(messages, 'ProjectTypes', 'ProjectCategories', 'PageEditControls')}>
            <DocsLayoutClient title={projectData.project.name}>
              {children}
            </DocsLayoutClient>
          </NextIntlClientProvider>
        </RightSidebarContextProvider>
      </LeftSidebarContextProvider>
    </NuqsAdapter>
  );
}
