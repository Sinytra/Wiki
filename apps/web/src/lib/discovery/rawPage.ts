import { ProjectPage } from '@sinytra/wiki-api-types';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import { Metadata } from 'next';
import { absoluteUrl } from '@/lib/discovery/langMods';
import { projectLlmsTxtPath } from '@/lib/discovery/navigation';

export const RAW_PAGE_SUFFIX = '.md';
export const ROOT_LLMS_TXT_PATH = '/llms.txt';

export function rawPagePath(pagePath: string): string {
  return pagePath + RAW_PAGE_SUFFIX;
}

export function markdownAlternate(pagePath: string): Metadata['alternates'] {
  return {
    types: {
      'text/markdown': rawPagePath(pagePath)
    }
  };
}

interface LinkRelation {
  href: string;
  rel: string;
  type?: string;
}

function linkHeader(links: LinkRelation[]): string {
  return links
    .map(({ href, rel, type }) => `<${absoluteUrl(href)}>; rel="${rel}"${type ? `; type="${type}"` : ''}`)
    .join(', ');
}

export function plainTextResponse(body: string, status: number = 200, links: LinkRelation[] = []): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'text/markdown; charset=utf-8'
  };
  if (links.length > 0) {
    headers['Link'] = linkHeader(links);
  }
  return new Response(body, { status, headers });
}

export function plainTextNotFound(message: string): Response {
  return plainTextResponse(`${message}\n`, 404);
}

export function plainTextError(message: string, error: unknown): Response {
  console.error(message, error);
  return plainTextResponse(`${message}\n`, 500);
}

export function projectLlmsTxtResponse(body: string): Response {
  return plainTextResponse(body, 200, [{ href: ROOT_LLMS_TXT_PATH, rel: 'describedby' }]);
}

export function rawPageResponse(page: ProjectPage, pagePath: string, params: ProjectRouteParams): Response {
  return plainTextResponse(page.content, 200, [
    { href: pagePath, rel: 'alternate', type: 'text/html' },
    { href: projectLlmsTxtPath(params), rel: 'describedby' }
  ]);
}
