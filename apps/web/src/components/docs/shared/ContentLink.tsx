import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {getContentLink} from "@/lib/project/game/content";
import {Link} from "@/lib/locales/routing";
import {ComponentPropsWithoutRef} from "react";
import {ProjectContext} from "@repo/shared/types/service";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@repo/shared/constants";

type LinkProps = ComponentPropsWithoutRef<typeof Link> & { id: string; ctx: ProjectContext };

export default async function ContentLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundContentLink({...props, ctx});
}

async function BoundContentLink(props: LinkProps) {
  const {ctx} = props;
  const link = getContentLink({ slug: ctx.id, version: ctx.version || DEFAULT_DOCS_VERSION, locale: ctx.locale || DEFAULT_LOCALE }, props.id);
  const body = props.children ?? (await service.getContentItemName(props.id, props.ctx))?.name;

  return (
    <PageLink {...props} href={link}>
      {body || props.id}
    </PageLink>
  )
}