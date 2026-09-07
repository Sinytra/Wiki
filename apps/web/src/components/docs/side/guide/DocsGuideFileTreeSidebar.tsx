import { HomeIcon } from 'lucide-react';
import DocsFileLink from '@/components/docs/util/DocsFileLink';
import DocsFileTreeFolder from '@/components/docs/layout/DocsFileTreeFolder';
import { useTranslations } from 'next-intl';
import ScrollableDocsSidebarBase from '@/components/docs/side/ScrollableDocsSidebarBase';
import { FileTree } from '@repo/shared/types/service';
import { FileTreeEntry } from '@sinytra/wiki-api-types';
import { NO_FOLDER_ICON } from '@repo/shared/constants';
import * as React from 'react';

interface LeftSidebarProps {
  slug: string;
  version: string;
  tree: FileTree;
}

async function DocsFileEntry({ slug, version, file }: { slug: string; version: string; file: FileTreeEntry }) {
  const LucideReact = await import('lucide-react');
  //@ts-expect-error icons
  const Icon = file.icon ? LucideReact[file.icon + 'Icon'] : null;
  return (
    <DocsFileLink key={file.path} href={`/project/${slug}/${version}/docs/${file.path}`}>
      {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
      {file.name}
    </DocsFileLink>
  );
}

async function DocsFileTree({
  slug,
  version,
  tree,
  level
}: {
  slug: string;
  version: string;
  tree: FileTree;
  level: number;
}) {
  const LucideReact = await import('lucide-react');

  return tree.map((file) => {
    if (file.type == 'dir') {
      // Categories have no icon by default; authors may still opt into one
      // @ts-expect-error icon
      const Icon = file.icon && file.icon !== NO_FOLDER_ICON ? LucideReact[file.icon] : null;

      return (
        <DocsFileTreeFolder
          key={file.path}
          name={file.name}
          path={file.path}
          level={level}
          icon={Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
        >
          <DocsFileTree slug={slug} version={version} tree={file.children} level={level + 1} />
        </DocsFileTreeFolder>
      );
    }
    return <DocsFileEntry key={file.path} slug={slug} version={version} file={file} />;
  });
}

export default function DocsGuideFileTreeSidebar({ slug, version, tree }: LeftSidebarProps) {
  const t = useTranslations('DocsLeftSidebar');

  return (
    <ScrollableDocsSidebarBase
      type="left"
      title={t('title')}
      className="left-0 mb-3 w-[96vw] shrink-0 border-tertiary sm:w-64 lg:rounded-sm"
      innerClassName="overscroll-contain bg-primary-alt"
      tagName="nav"
    >
      <DocsFileLink href={`/project/${slug}/${version}/docs`}>
        <HomeIcon className="mr-2 h-4 w-4" />
        {t('homepage')}
      </DocsFileLink>

      <hr />

      <DocsFileTree slug={slug} version={version} tree={tree} level={1} />
    </ScrollableDocsSidebarBase>
  );
}
