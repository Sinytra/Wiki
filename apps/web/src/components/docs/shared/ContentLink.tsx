import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {getContentLink} from "@/lib/project/game/content";
import {Link} from "@/lib/locales/routing";
import {ComponentPropsWithoutRef} from "react";
import {ProjectContentEntry, ProjectContext} from "@repo/shared/types/service";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@repo/shared/constants";

type LinkProps = ComponentPropsWithoutRef<typeof Link> & { id: string; ctx: ProjectContext };

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

export default async function ContentLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundContentLink({...props, ctx});
}

async function BoundContentLink(props: LinkProps) {
  const {ctx} = props;
  const link = getContentLink({ slug: ctx.id, version: ctx.version || DEFAULT_DOCS_VERSION, locale: ctx.locale || DEFAULT_LOCALE }, props.id);
  const body = props.children ?? await getLocalizedPageName(props.id, ctx);

  return (
    <PageLink {...props} href={link}>
      {body || props.id}
    </PageLink>
  )
}