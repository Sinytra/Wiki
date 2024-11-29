import ProjectHomepageLink from "@/components/docs/ProjectHomepageLink";
import DocsEntryLink from "@/components/docs/DocsEntryLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import {getTranslations} from "next-intl/server";
import * as LucideIcons from 'lucide-react';
import DirectoryTreeView from "@/components/docs/tree/DirectoryTreeView";
import {FileTree, FileTreeEntry} from "@/lib/service";

function FileIcon<T extends { file: FileTreeEntry } & Record<string, any>>({file, ...props}: T) {
  if (file.icon) {
    // @ts-ignore
    const Component = LucideIcons[file.icon + 'Icon'];
    if (Component) {
      return <Component width="20" height="20" {...props}/>;
    }
  }
  return (<></>);
}

function DocsFileTree({slug, version, tree, level}: {
  slug: string;
  version: string;
  tree: FileTree;
  level: number;
}) {
  const offset = level > 0 ? '0.6rem' : 0;

  return <>
    {tree.map((file) => (
      file.type === 'dir'
        ? <DirectoryTreeView key={file.path} level={level + 1} newBasePath={file.path}
                             trigger={
                               <span className="inline-flex items-center gap-2">
                                 <FileIcon file={file}/> {file.name}
                               </span>
                             }
        >
          <DocsFileTree slug={slug} version={version} tree={file.children!} level={level + 1} />
        </DirectoryTreeView>
        :
        <div key={file.path} className="w-full pt-2"
             style={{marginLeft: offset, paddingRight: offset}}>
          <DocsEntryLink href={`/mod/${slug}/${version}/${file.path}`}>
            <FileIcon file={file} width="18" height="18" strokeWidth={1.8}/> {file.name.split('.')[0].replace('_', ' ')}
          </DocsEntryLink>
        </div>
    ))}
  </>
}

export default async function DocsTree({slug, version, tree}: {
  slug: string;
  version: string;
  tree: FileTree;
}) {
  const t = await getTranslations('DocsFileTree');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <ProjectHomepageLink text={t('homepage')} slug={slug} version={version}/>

      <hr className="mt-2"/>

      <div className="flex flex-col overflow-y-scroll slim-scrollbar h-full">
        <DocsFileTree slug={slug} version={version} tree={tree} level={0}/>
      </div>
    </CollapsibleDocsTreeBase>
  );
}