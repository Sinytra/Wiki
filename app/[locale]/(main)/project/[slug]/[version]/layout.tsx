import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@/lib/platforms";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/new/DocsLayoutClient";
import {HOMEPAGE_FILE_PATH} from "@/lib/constants";
import {redirect} from "next/navigation";
import {getPlatformProjectInformation} from "@/components/docs/project-info/projectInfo";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";

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

  const platformProject = await platforms.getPlatformProject(projectData.project);

  const info = await getPlatformProjectInformation(platformProject);

  return (
    <NextIntlClientProvider messages={pick(messages, 'ProjectTypes', 'ProjectCategories')}>
      <DocsLayoutClient
        project={projectData.project}
        platformProject={platformProject}
        projectInfo={info}
        version={params.version}
        locale={params.locale}
        tree={projectData.tree}
      >
        {children}
      </DocsLayoutClient>
    </NextIntlClientProvider>
  );
}
