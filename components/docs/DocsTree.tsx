import sources, {FileTreeNode} from "@/lib/docs/sources";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import ModHomepageLink from "@/components/docs/ModHomepageLink";
import DocsEntryLink from "@/components/docs/DocsEntryLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import {getTranslations} from "next-intl/server";

function DirectoryTreeView({slug, tree, level, basePath, open}: {
  slug: string;
  tree: FileTreeNode[];
  level: number;
  basePath: string;
  open?: boolean;
}) {
  if (tree.length === 0) {
    return <></>
  }

  const defaultValues = open && tree.length > 0 ? [`${basePath}/${tree[0].path}`] : [];

  return (
    <Accordion className="[&:not(:last-child)_.docsAccordeonTrigger]:border-b" defaultValue={defaultValues}
               type="multiple" style={{paddingLeft: `${((level - 1) * 0.4)}rem`}}>
      {tree.map(dir => {
        const newBasePath = `${basePath}/${dir.path}`;
        return (
          <AccordionItem key={newBasePath} value={newBasePath} className="!border-none">
            <AccordionTrigger
              className="docsAccordeonTrigger px-1 capitalize border-accent [&_svg]:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 transition-none">
              <span>{dir.name}</span>
            </AccordionTrigger>
            <AccordionContent>
              <DocsFileTree slug={slug} tree={dir.children!} level={level + 1} basePath={newBasePath}/>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  )
}

function DocsFileTree({slug, tree, level, basePath}: {
  slug: string;
  tree: FileTreeNode[];
  level: number;
  basePath: string;
}) {
  const offset = level > 0 ? '0.6rem' : 0;

  return <>
    {tree.map((file, index) => (
      file.type === 'directory'
        ? <DirectoryTreeView key={`${basePath}/${file.path}`} slug={slug} tree={[file]} level={level + 1}
                             basePath={basePath} open={index === 0}/>
        :
        <div key={`${basePath}/${file.path}`} className="capitalize w-full pt-2"
             style={{marginLeft: offset, paddingRight: offset}}>
          <DocsEntryLink href={`/mod/${slug}/docs${basePath}/${file.path.split('.')[0]}`}>
            {file.name.split('.')[0].replace('_', ' ')}
          </DocsEntryLink>
        </div>
    ))}
  </>
}

export default async function DocsTree({slug, locale}: { slug: string; locale: string }) {
  const source = await sources.getProjectSource(slug);
  const docsTree = await sources.readDocsTree(source, locale);
  const t = await getTranslations('DocsFileTree');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <ModHomepageLink text={t('homepage')} slug={slug}/>

      <hr className="mt-2"/>

      <div className="flex flex-col overflow-y-scroll slim-scrollbar h-full">
        <DocsFileTree slug={slug} tree={docsTree} level={0} basePath={''}/>
      </div>
    </CollapsibleDocsTreeBase>
  );
}