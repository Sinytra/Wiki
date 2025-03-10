import * as LucideIcons from 'lucide-react';
import {HomeIcon} from 'lucide-react';
import {FileTree, FileTreeEntry} from "@/lib/service";
import DocsFileLink from "@/components/docs/util/DocsFileLink";
import DocsFileTreeFolder from "@/components/docs/layout/DocsFileTreeFolder";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import ScrollableDocsSidebarBase from "@/components/docs/side/ScrollableDocsSidebarBase";

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
      href={`/project/${slug}/${version}/${file.path}`}
    >
      {Icon && <Icon className="shrink-0 w-4 h-4 mr-2"/>}
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

export default function DocsLeftSidebar({slug, version, tree}: LeftSidebarProps) {
  const t = useTranslations('DocsLeftSidebar');

  return (
    <ScrollableDocsSidebarBase title={t('title')} tagName="nav" type="left" className={cn(
      'shrink-0 left-0',
      'w-[96vw] sm:w-64 data-[open=false]:-translate-x-full lg:data-[open=false]:-translate-x-0',
      'border-r data-[open=false]:border-0 lg:data-[open=false]:border-r'
    )} innerClassName="overscroll-contain">
      <DocsFileLink href={`/project/${slug}/${version}`}>
        <HomeIcon className="w-4 h-4 mr-2"/>
        {t('homepage')}
      </DocsFileLink>

      <hr/>

      <DocsFileTree slug={slug} version={version} tree={tree} level={1}/>
    </ScrollableDocsSidebarBase>
  )
}

