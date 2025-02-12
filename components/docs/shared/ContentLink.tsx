import {getParams} from "@nimpl/getters/get-params";
import {createSharedPathnamesNavigation} from "next-intl/navigation";
import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";

type LinkProps = Parameters<ReturnType<typeof createSharedPathnamesNavigation>['Link']>[0] & { id: string };

async function getLocalizedPageName(slug: string, id: string): Promise<string | null> {
  const contents = await service.getProjectContents(slug);
  if (!contents) {
    return null;
  }
  for (const entry of contents) {
    for (const child of entry.children) {
      if (child.id === id) {
        return child.name;
      }
    }
  }
  return null;
}

function getExternalWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_RSLOC_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}

function getLink(params: any, id: string): string {
  return getExternalWikiLink(id) ?? `/${params.locale}/project/${params.slug}/${params.version}/content/${id}`;
}

export default async function ContentLink(props: LinkProps) {
  const params = getParams() || {};

  const link = getLink(params, props.id);
  const body = props.children ?? await getLocalizedPageName(params.slug as string, props.id);

  return (
    <PageLink {...props} href={link}>
      {body}
    </PageLink>
  )
}