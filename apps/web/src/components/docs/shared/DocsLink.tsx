import PageLink from "@/components/docs/PageLink";
import {getDocsLink} from "@/lib/game/content";
import {Link} from "@/lib/locales/routing";
import {ComponentPropsWithoutRef} from "react";
import {FileTree, FileTreeEntry, ProjectContext} from "@repo/shared/types/service";
import service from "@/lib/service";
import {getTranslations} from "next-intl/server";

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & { path: string; ctx: ProjectContext };

function findNestedPath(path: string[], fullPath: string, idx: number, tree: FileTree): FileTreeEntry | null {
  if (idx >= path.length) {
    return null;
  }

  for (const entry of tree) {
    if (entry.path === fullPath) {
      return entry;
    }

    if (entry.type === 'dir' && entry.path == path[idx]!) {
      return findNestedPath(path, fullPath, idx + 1, entry.children);
    }
  }

  return null;
}

async function getDocsPage(path: string[], fullPath: string, ctx: ProjectContext): Promise<FileTreeEntry | null> {
  const contents = await service.getBackendLayout(ctx);
  if (!contents) {
    return null;
  }
  return findNestedPath(path, fullPath, 0, contents.tree) || null;
}

export default async function DocsLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundDocsLink({...props, ctx});
}

async function BoundDocsLink(props: LinkProps) {
  const {path, ctx, children} = props;
  const t = await getTranslations('DocsLink');

  const page = await getDocsPage(path.split('/'), path, ctx);
  if (!page) {
    return (
      <span className="text-destructive">
        {children ?? t('not_found')}
      </span>
    );
  }

  const link = getDocsLink(page.path, ctx);
  const body = children ?? page.name;

  return (
    <PageLink {...props} href={link}>
      {body || props.id}
    </PageLink>
  )
}