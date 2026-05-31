import PageLink from '@/components/docs/PageLink';
import {ComponentPropsWithoutRef} from 'react';
import {ProjectContext} from '@repo/shared/types/service';
import {LocaleLink} from '@/lib/locales/routing';
import {getDocsLink} from '@/lib/project/game/content';

type LinkProps = Omit<ComponentPropsWithoutRef<typeof LocaleLink>, 'href'> & { path: string; ctx: ProjectContext };

export default function DocsLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundDocsLink({...props, ctx});
}

function BoundDocsLink(props: LinkProps) {
  const {path, ctx} = props;

  const link = getDocsLink(path, ctx);
  return (
    <PageLink {...props} href={link} />
  );
}