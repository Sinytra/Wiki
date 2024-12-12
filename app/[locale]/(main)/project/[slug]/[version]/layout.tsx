import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import DocsLayoutClient from "@/components/docs/new/DocsLayoutClient";
import {redirect} from "next/navigation";
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

  return (
    <NextIntlClientProvider messages={pick(messages, 'ProjectTypes', 'ProjectCategories', 'PageEditControls')}>
      <DocsLayoutClient>
        {children}
      </DocsLayoutClient>
    </NextIntlClientProvider>
  );
}
