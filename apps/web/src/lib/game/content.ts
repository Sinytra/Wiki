import resourceLocation, {DEFAULT_NAMESPACE} from "@repo/shared/resourceLocation";

import {ProjectContext, ResolvedItem} from "@repo/shared/types/service";
import {ProjectRouteParams} from "@repo/shared/types/routes";

export function getResolvedItemLink(params: ProjectRouteParams | ProjectContext, item: ResolvedItem): string | null {
  const slug = 'slug' in params ? params.slug : params.id;
  return getExternalWikiLink(item.id) ?? (item.has_page ? `/${params.locale}/project/${slug}/${params.version}/content/${item.id}` : null);
}

export function getContentLink(params: ProjectRouteParams | ProjectContext, id: string): string {
  const slug = 'slug' in params ? params.slug : params.id;
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${slug}/${params.version}/content/${id}`;
}

export function getInternalWikiLink(id: string, params: ProjectRouteParams | ProjectContext): string {
  const slug = 'slug' in params ? params.slug : params.id;
  return `/${params.locale}/project/${slug}/${params.version}/content/${id}`;
}

export function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}

export function getDocsLink(path: string, ctx: ProjectContext): string {
  return `/${ctx.locale}/project/${ctx.id}/${ctx.version}/docs/${path}`;
}