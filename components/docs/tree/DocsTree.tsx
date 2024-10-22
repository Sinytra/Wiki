import sources, {DocumentationSource, FileTreeNode} from "@/lib/docs/sources";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import ModHomepageLink from "@/components/docs/ModHomepageLink";
import DocsEntryLink from "@/components/docs/DocsEntryLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import {getTranslations} from "next-intl/server";
import * as LucideIcons from 'lucide-react';
import DirectoryTreeViewBase from "@/components/docs/tree/DirectoryTreeViewBase";

function FileIcon<T extends { file: FileTreeNode } & Record<string, any>>({file, ...props}: T) {
  if (file.icon) {
    // @ts-ignore
    const Component = LucideIcons[file.icon + 'Icon'];
    if (Component) {
      return <Component width="20" height="20" {...props}/>;
    }
  }
  return <></>;
}

function DirectoryTreeView({slug, version, file, level, basePath, open}: {
  slug: string;
  version: string;
  file: FileTreeNode;
  level: number;
  basePath: string;
  open?: boolean;
}) {
  const newBasePath = `${basePath}/${file.path}`;

  return (
    <DirectoryTreeViewBase level={level} defaultValue={newBasePath} open={open}>
      <AccordionItem key={newBasePath} value={newBasePath} className="!border-none">
        <AccordionTrigger
          className="docsAccordeonTrigger px-1 capitalize border-accent [&>svg]:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 transition-none">
          <span className="inline-flex items-center gap-2">
            <FileIcon file={file} /> {file.name}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <DocsFileTree slug={slug} version={version} tree={file.children!} level={level + 1}
                        basePath={newBasePath}/>
        </AccordionContent>
      </AccordionItem>
    </DirectoryTreeViewBase>
  )
}

function DocsFileTree({slug, version, tree, level, basePath}: {
  slug: string;
  version: string;
  tree: FileTreeNode[];
  level: number;
  basePath: string;
}) {
  const offset = level > 0 ? '0.6rem' : 0;

  return <>
    {tree.map((file, index) => (
      file.type === 'directory'
        ? <DirectoryTreeView key={`${basePath}/${file.path}`} slug={slug} version={version} file={file}
                             level={level + 1} basePath={basePath} open={index === 0}/>
        :
        <div key={`${basePath}/${file.path}`} className="capitalize w-full pt-2"
             style={{marginLeft: offset, paddingRight: offset}}>
          <DocsEntryLink href={`/mod/${slug}/${version}${basePath}/${file.path.split('.')[0]}`}>
            <FileIcon file={file} width="18" height="18" strokeWidth={1.8} /> {file.name.split('.')[0].replace('_', ' ')}
          </DocsEntryLink>
        </div>
    ))}
  </>
}

export default async function DocsTree({source, locale, version}: {
  source: DocumentationSource;
  locale: string;
  version: string;
}) {
  const docsTree = await sources.readDocsTree(source, locale);
  const t = await getTranslations('DocsFileTree');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <ModHomepageLink text={t('homepage')} slug={source.id} version={version}/>

      <hr className="mt-2"/>

      <div className="flex flex-col overflow-y-scroll slim-scrollbar h-full">
        <DocsFileTree slug={source.id} version={version} tree={docsTree} level={0} basePath={''}/>
      </div>
    </CollapsibleDocsTreeBase>
  );
}