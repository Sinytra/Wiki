import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import {ResolvedItem} from "@/lib/service/types";

interface RouteParams {
  locale: string;
  slug: string;
  version: string;
}

export function getResolvedItemLink(params: any, item: ResolvedItem): string | null {
  return getExternalWikiLink(item.id) ?? item.has_page ? `/${params.locale}/project/${params.slug}/${params.version}/content/${item.id}` : null;
}

export function getContentLink(params: any, id: string): string {
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export function getInternalWikiLink(id: string, params: RouteParams): string {
  return `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_RSLOC_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}