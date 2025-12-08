import ContentLink from "@/components/docs/shared/ContentLink";
import {ComponentPropsWithoutRef} from "react";
import {ProjectContext} from "@repo/shared/types/service";
import PageLink from "@/components/docs/PageLink";
import DocsLink from "@/components/docs/shared/DocsLink";

type LinkProps = ComponentPropsWithoutRef<typeof PageLink> & { ctx: ProjectContext };

export default function ExtendedLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundExtendedLink({...props, ctx});
}

function BoundExtendedLink(props: LinkProps) {
  if (props.href) {
    if (props.href.toString().startsWith('@')) {
      const id = props.href.toString().substring(1);
      return ContentLink(props.ctx, {id, ...props});
    } else if (props.href.toString().startsWith('$')) {
      const path = props.href.toString().substring(1);
      return DocsLink(props.ctx, {path, ...props});
    }
  }

  return <PageLink {...props} />
}