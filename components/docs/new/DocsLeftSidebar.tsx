import * as LucideIcons from 'lucide-react'
import {Book, FolderOpenIcon, HomeIcon} from 'lucide-react'
import {FileTree, FileTreeEntry} from "@/lib/service";
import DocsFileLink from "@/components/docs/new/DocsFileLink";
import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";

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

function DocsFolderEntry({slug, version, file}: { slug: string; version: string; file: FileTreeEntry }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
        <FolderOpenIcon className="w-4 h-4 mr-2"/>
        {file.name}
      </div>
      <div className="ml-4">
        <DocsFileTree slug={slug} version={version} tree={file.children}/>
      </div>
    </div>
  );
}

function DocsFileTree({slug, version, tree}: { slug: string; version: string; tree: FileTree }) {
  return tree.map(file => {
    if (file.type == 'dir') {
      return <DocsFolderEntry key={file.path} slug={slug} version={version} file={file}/>
    }
    return <DocsFileEntry key={file.path} slug={slug} version={version} file={file}/>
  })
}

export default function LeftSidebar({isOpen, slug, version, tree}: LeftSidebarProps) {
  return (
    <DocsSidebarBase title="Documentation" tagName="nav" className={`
      ${isOpen ? '' : '-translate-x-full'}
      ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
    `}>
      <DocsFileLink href={`/project/${slug}/${version}`}>
        <HomeIcon className="w-4 h-4 mr-2"/>
        Mod Homepage
      </DocsFileLink>

      <hr/>

      <DocsFileTree slug={slug} version={version} tree={tree}/>
    </DocsSidebarBase>
  )
}

