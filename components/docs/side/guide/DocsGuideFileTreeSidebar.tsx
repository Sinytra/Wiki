import * as LucideIcons from 'lucide-react';
import {HomeIcon} from 'lucide-react';
import DocsFileLink from "@/components/docs/util/DocsFileLink";
import DocsFileTreeFolder from "@/components/docs/layout/DocsFileTreeFolder";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import ScrollableDocsSidebarBase from "@/components/docs/side/ScrollableDocsSidebarBase";
import {FileTree, FileTreeEntry} from "@repo/shared/types/service";

interface LeftSidebarProps {
  slug: string;
  version: string;
  tree: FileTree;
}

function DocsFileEntry({slug, version, file}: { slug: string; version: string; file: FileTreeEntry }) {
  // @ts-ignore
  const Icon = file.icon ? LucideIcons[file.icon + 'Icon'] : null;
  return (
    <DocsFileLink
      key={file.path}
      href={`/project/${slug}/${version}/docs/${file.path}`}
    >
      {Icon && <Icon className="mr-2 h-4 w-4 shrink-0"/>}
      {file.name}
    </DocsFileLink>
  );
}

function DocsFileTree({slug, version, tree, level}: { slug: string; version: string; tree: FileTree; level: number }) {
  return tree.map(file => {
    if (file.type == 'dir') {
      return (
        <DocsFileTreeFolder key={file.path} name={file.name} path={file.path} level={level} icon={file.icon}>
          <DocsFileTree slug={slug} version={version} tree={file.children} level={level + 1}/>
        </DocsFileTreeFolder>
      );
    }
    return <DocsFileEntry key={file.path} slug={slug} version={version} file={file}/>
  })
}

export default function DocsGuideFileTreeSidebar({slug, version, tree}: LeftSidebarProps) {
  const t = useTranslations('DocsLeftSidebar');

  return (
    <ScrollableDocsSidebarBase
      type="left"
      title={t('title')}
      className={cn(
        'left-0 shrink-0',
        'w-[96vw] sm:w-64'
      )}
      innerClassName="overscroll-contain"
      tagName="nav"
    >
      <DocsFileLink href={`/project/${slug}/${version}/docs`}>
        <HomeIcon className="mr-2 h-4 w-4"/>
        {t('homepage')}
      </DocsFileLink>

      <hr/>

      <DocsFileTree slug={slug} version={version} tree={tree} level={1}/>
    </ScrollableDocsSidebarBase>
  )
}

