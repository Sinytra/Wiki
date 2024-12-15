import * as LucideIcons from 'lucide-react';
import {Book, HomeIcon} from 'lucide-react';
import {FileTree, FileTreeEntry} from "@/lib/service";
import DocsFileLink from "@/components/docs/new/DocsFileLink";
import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";
import DocsFileTreeFolder from "@/components/docs/new/DocsFileTreeFolder";
import {cn} from "@/lib/utils";

interface LeftSidebarProps {
  slug: string;
  version: string;
  tree: FileTree;
  isOpen: boolean;
}

function DocsFileEntry({slug, version, file}: { slug: string; version: string; file: FileTreeEntry }) {
  // @ts-ignore
  const Icon = LucideIcons[file.icon + 'Icon'] || Book;
  return (
    <DocsFileLink
      key={file.path}
      href={`/project/${slug}/${version}/${file.path}`}
    >
      <Icon className="w-4 h-4 mr-2"/>
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

export default function LeftSidebar({isOpen, slug, version, tree}: LeftSidebarProps) {
  return (
    <DocsSidebarBase title="Documentation" tagName="nav" className={cn(
      'flex-shrink-0 sm:sticky sm:top-20',
      'data-[open=false]:-translate-x-full data-[open=false]:w-0 data-[open=false]:lg:w-64',
      isOpen ? '' : '-translate-x-full',
      isOpen ? 'w-64' : 'w-0 lg:w-64',
      'border-r'
    )}>
      <DocsFileLink href={`/project/${slug}/${version}`}>
        <HomeIcon className="w-4 h-4 mr-2"/>
        Mod Homepage
      </DocsFileLink>

      <hr/>

      <DocsFileTree slug={slug} version={version} tree={tree} level={1}/>
    </DocsSidebarBase>
  )
}

