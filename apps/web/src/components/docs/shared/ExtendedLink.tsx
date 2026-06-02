import { ComponentPropsWithoutRef } from 'react';
import { PageLinks, ProjectContext } from '@repo/shared/types/service';
import PageLink from '@/components/docs/PageLink';
import { resolveLink, TargetLink } from '@/lib/project/game/content';
import { useTranslations } from 'next-intl';

type LinkProps = ComponentPropsWithoutRef<typeof PageLink> & {
  ctx: ProjectContext;
  links: PageLinks;
};

export default function ExtendedLink(ctx: ProjectContext, links: PageLinks, props: Omit<LinkProps, 'ctx'>) {
  return BoundExtendedLink({ ...props, ctx, links });
}

function BoundExtendedLink({ ctx, links, ...props }: LinkProps) {
  const t = useTranslations('ExtendedLink');
  let resolved: TargetLink | null = null;

  if (props.href && typeof props.href === 'string') {
    resolved = resolveLink(ctx, links, props.href as string);

    if (!resolved && (props.href.startsWith('@') || props.href.startsWith('$') || props.href.startsWith('+'))) {
      return <span className="text-destructive">{props.children ?? t('not_found')}</span>;
    }
  }

  return (
    <PageLink {...props} href={resolved?.url ?? props.href}>
      {props.children ?? resolved?.title ?? '(not found)'}
    </PageLink>
  );
}
