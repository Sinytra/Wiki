import * as LucideIcons from 'lucide-react';
import {HomeIcon} from 'lucide-react';
import {FileTree, FileTreeEntry} from "@/lib/service";
import DocsFileLink from "@/components/docs/util/DocsFileLink";
import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import DocsFileTreeFolder from "@/components/docs/layout/DocsFileTreeFolder";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";

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
      {Icon && <Icon className="flex-shrink-0 w-4 h-4 mr-2"/>}
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
    <DocsSidebarBase title={t('title')} tagName="nav" className={cn(
      'flex-shrink-0 sm:sticky sm:top-20',
      'data-[open=true]:w-64 data-[open=false]:-translate-x-full data-[open=false]:lg:-translate-x-0 data-[open=false]:w-0 data-[open=false]:lg:w-64',
      'border-r data-[open=false]:border-0 data-[open=false]:lg:border-r'
    )} innerClassName="overscroll-contain">
      <DocsFileLink href={`/project/${slug}/${version}`}>
        <HomeIcon className="w-4 h-4 mr-2"/>
        {t('homepage')}
      </DocsFileLink>

      <hr/>

      <DocsFileTree slug={slug} version={version} tree={tree} level={1}/>
    </DocsSidebarBase>
  )
}

