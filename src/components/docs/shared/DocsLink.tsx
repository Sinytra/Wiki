import PageLink from "@/components/docs/PageLink";
import {getDocsLink} from "@/lib/game/content";
import {Link} from "@/lib/locales/routing";
import {ComponentPropsWithoutRef} from "react";
import {FileTree, FileTreeEntry, ProjectContext} from "@repo/shared/types/service";
import service from "@/lib/service";
import {getTranslations} from "next-intl/server";

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & { path: string; ctx: ProjectContext };

function findNestedPath(path: string[], idx: number, tree: FileTree): FileTreeEntry | null {
  if (idx >= path.length) {
    return null;
  }

  const target = path[idx]!;
  for (const entry of tree) {
    if (entry.path == target) {
      if (entry.type === 'dir') {
        return findNestedPath(path, idx + 1, entry.children);
      }
      return entry;
    }
  }

  return null;
}

async function getDocsPage(path: string[], ctx: ProjectContext): Promise<FileTreeEntry | null> {
  const contents = await service.getBackendLayout(ctx);
  if (!contents) {
    return null;
  }
  return findNestedPath(path, 0, contents.tree) || null;
}

export default async function DocsLink(ctx: ProjectContext, props: Omit<LinkProps, 'ctx'>) {
  return BoundDocsLink({...props, ctx});
}

async function BoundDocsLink(props: LinkProps) {
  const {path, ctx, children} = props;
  const t = await getTranslations('DocsLink');

  const page = await getDocsPage(path.split('/'), ctx);
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