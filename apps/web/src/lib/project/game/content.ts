import resourceLocation, {DEFAULT_NAMESPACE} from '@repo/shared/resourceLocation';

import {PageLinks, ProjectContext} from '@repo/shared/types/service';
import {ProjectRouteParams} from '@repo/shared/types/routes';
import {ResolvedItem} from '@sinytra/wiki-api-types';

export type TargetLink = {
  title?: string | null;
  url: string;
};

function encodeID(id: string) {
  return id.includes('/') ? encodeURIComponent(id) : id;
}

export function resolveLink(ctx: ProjectContext, links: PageLinks, url: string): TargetLink | null {
  const resolved = links[url];
  if (resolved) {
    if (resolved.type == 'vanilla') {
      return { title: resolved.title, url: getVanillaWikiLink(resolved.ref) };
    }
    if (resolved.type == 'docs') {
      return { title: resolved.title, url: getDocsLink(resolved.ref, ctx) };
    }
    if (resolved.type == 'content') {
      return { title: resolved.title, url: getInternalWikiLink(resolved.ref, ctx) };
    }
  }
  return null;
}

export function getResolvedItemLink(params: ProjectRouteParams | ProjectContext, item: ResolvedItem): string | null {
  return getExternalWikiLink(item.id) ?? (item.page_ref != null ? getInternalWikiLink(item.page_ref, params) : null);
}

// TODO Phase out
export function getContentLink(params: ProjectRouteParams | ProjectContext, id: string): string {
  const slug = 'slug' in params ? params.slug : params.id;
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${slug}/${params.version}/content/${encodeID(id)}`;
}

export function getInternalWikiLink(ref: string, params: ProjectRouteParams | ProjectContext): string {
  const slug = 'slug' in params ? params.slug : params.id;
  return `/${params.locale}/project/${slug}/${params.version}/content/${ref}`;
}

export function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_NAMESPACE && id.startsWith(DEFAULT_NAMESPACE + ':') ? `https://minecraft.wiki/w/${loc.path}` : null;
}

export function getVanillaWikiLink(page: string): string {
  return `https://minecraft.wiki/w/${page}`;
}

export function getDocsLink(path: string, ctx: ProjectContext): string {
  return `/${ctx.locale}/project/${ctx.id}/${ctx.version}/docs/${path}`;
}