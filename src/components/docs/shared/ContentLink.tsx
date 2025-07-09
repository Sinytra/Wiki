import {getParams} from "@nimpl/getters/get-params";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {getContentLink} from "@/lib/game/content";
import {Link} from "@/lib/locales/routing";
import {ComponentPropsWithoutRef} from "react";
import {ProjectContentEntry, ProjectContext} from "@repo/shared/types/service";

type LinkProps = ComponentPropsWithoutRef<typeof Link> & { id: string };

function flattenChildren(entries: ProjectContentEntry[]): ProjectContentEntry[] {
  return [...entries, ...entries.flatMap(e => flattenChildren(e.children || []))];
}

async function getLocalizedPageName(id: string, ctx: ProjectContext): Promise<string | null> {
  const contents = await service.getProjectContents(ctx);
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

  const link = getContentLink(params as any, props.id);
  const ctx = {id: params.slug as string, version: params.version as string | null, locale: params.locale as string | null};
  const body = props.children
    ?? await getLocalizedPageName(props.id, ctx);

  return (
    <PageLink {...props} href={link}>
      {body || props.id}
    </PageLink>
  )
}