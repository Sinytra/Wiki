import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import {ResolvedItem} from "@/lib/service/types";

export interface ContentRouteParams {
  locale: string;
  slug: string;
  version: string;
}

export function getResolvedItemLink(params: ContentRouteParams, item: ResolvedItem): string | null {
  return getExternalWikiLink(item.id) ?? (item.has_page ? `/${params.locale}/project/${params.slug}/${params.version}/content/${item.id}` : null);
}

export function getContentLink(params: ContentRouteParams, id: string): string {
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export function getInternalWikiLink(id: string, params: ContentRouteParams): string {
  return `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_RSLOC_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}