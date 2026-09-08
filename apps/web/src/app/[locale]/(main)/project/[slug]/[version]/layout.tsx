import { ReactNode } from 'react';
import { setContextLocale } from '@/lib/locales/routing';
import service from '@/lib/service';
import DocsLayoutClient from '@/components/docs/layout/DocsLayoutClient';
import { notFound } from 'next/navigation';
import LeftSidebarContextProvider from '@/components/docs/side/LeftSidebarContext';
import platforms from '@repo/shared/platforms';
import { Metadata } from 'next';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import LocalSearchSetter from '@/components/navigation/search/LocalSearchSetter';
import { projectBasePath, projectLlmsTxtPath } from '@/lib/discovery/navigation';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import { projectPageMetadata } from '@/lib/seo';

export const fetchCache = 'default-cache';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
  }>;
}

export async function generateMetadata(props: { params: Promise<ProjectRouteParams> }): Promise<Metadata> {
  const params = await props.params;
  const { slug, version, locale } = params;

  const project = await service.getProject({ id: slug, version, locale });
  if (!project) {
    return {};
  }

  const platformProject = await platforms.getPlatformProjectOrNull(project);
  if (!platformProject) {
    return {};
  }

  return {
    title: {
      default: platformProject.name,
      template: `%s - ${platformProject.name}`
    },
    ...projectPageMetadata(project, params, {
      path: (prefix) => projectBasePath({ ...params, locale: prefix }),
      description: platformProject.summary
    })
  };
}

export default async function HomepageLayout(props: LayoutProps) {
  const params = await props.params;
  const { slug, version, locale } = params;
  const ctx = { id: slug, version, locale };
  const { children } = props;
  setContextLocale(locale);

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  const platformProject = await platforms.getPlatformProjectOrNull(project);
  if (!platformProject) {
    return notFound();
  }

  return (
    <LeftSidebarContextProvider>
      <link rel="describedby" href={projectLlmsTxtPath(params)} />

      <LocalSearchSetter project={project}>
        <ClientLocaleProvider
          keys={[
            'DocsPageError',
            'DocsPageNotFound',
            'ProjectTypes',
            'ProjectCategories',
            'PageEditControls',
            'DocsVersionSelector',
            'LanguageSelect',
            'ModVersionRange',
            'DocsFloatingNav'
          ]}
        >
          <DocsLayoutClient project={project} locale={locale} version={version} platformProject={platformProject}>
            {children}
          </DocsLayoutClient>
        </ClientLocaleProvider>
      </LocalSearchSetter>
    </LeftSidebarContextProvider>
  );
}
