import {getParams} from "@nimpl/getters/get-params";
import {createSharedPathnamesNavigation} from "next-intl/navigation";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {getContentLink} from "@/lib/game/content";

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

export default async function ContentLink(props: LinkProps) {
  const params = getParams() || {};

  const link = getContentLink(params, props.id);
  const body = props.children ?? await getLocalizedPageName(params.slug as string, props.id);

  return (
    <PageLink {...props} href={link}>
      {body}
    </PageLink>
  )
}