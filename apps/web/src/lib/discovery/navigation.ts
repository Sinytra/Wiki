import { ProjectRouteParams } from '@repo/shared/types/routes';

function getProjectLink(id: string): string {
  return `/project/${id}`;
}

function getDevProjectLink(id: string): string {
  return `/en/dev/project/${id}`;
}

function authorDashboard(): string {
  return '/dev';
}

export function projectBasePath({ locale, slug, version }: ProjectRouteParams): string {
  return `/${locale}/project/${slug}/${version}`;
}

export function projectLlmsTxtPath(params: ProjectRouteParams): string {
  return `${projectBasePath(params)}/llms.txt`;
}

export function docsHomepagePath(params: ProjectRouteParams): string {
  return `${projectBasePath(params)}/docs`;
}

export function docsPagePath(params: ProjectRouteParams, path: string[]): string {
  return `${docsHomepagePath(params)}/${path.join('/')}`;
}

export function contentPagePath(params: ProjectRouteParams, id: string): string {
  return `${projectBasePath(params)}/content/${encodeURIComponent(id)}`;
}

export default {
  getProjectLink,
  getDevProjectLink,
  authorDashboard
};
