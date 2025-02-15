import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";

export function getContentLink(params: any, id: string): string {
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_RSLOC_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}