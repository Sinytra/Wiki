import {getParams} from "@nimpl/getters/get-params";
import {createSharedPathnamesNavigation} from "next-intl/navigation";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {getContentLink} from "@/lib/game/content";
import {ProjectContentEntry} from "@/lib/service/types";

type LinkProps = Parameters<ReturnType<typeof createSharedPathnamesNavigation>['Link']>[0] & { id: string };

function flattenChildren(entries: ProjectContentEntry[]): ProjectContentEntry[] {
  return [...entries, ...entries.flatMap(e => flattenChildren(e.children))];
}

async function getLocalizedPageName(slug: string, id: string): Promise<string | null> {
  const contents = await service.getProjectContents(slug);
  if (!contents) {
    return null;
  }
  const flat = flattenChildren(contents);
  for (const entry of flat) {
    if (entry.id === id) {
      return entry.name;
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
      {body || props.id}
    </PageLink>
  )
}