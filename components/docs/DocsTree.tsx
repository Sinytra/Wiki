import sources, {FileTreeNode} from "@/lib/docs/sources";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import ModHomepageLink from "@/components/docs/ModHomepageLink";
import DocsEntryLink from "@/components/docs/DocsEntryLink";

interface Props {
  slug: string;
}

function DirectoryTreeView({slug, tree, level, basePath}: {
  slug: string;
  tree: FileTreeNode[];
  level: number;
  basePath: string
}) {
  if (tree.length === 0) {
    return <></>
  }

  const defaultValues = tree.map(dir => `${basePath}/${dir.path}`);
  // const [values, setValues] = useState<string[]>([]);

  return (
    <Accordion defaultValue={defaultValues} type="multiple" style={{paddingLeft: `${((level - 1) * 0.4)}rem`}}>
      {tree.map(dir => {
        const newBasePath = `${basePath}/${dir.path}`;
        return (
          <AccordionItem key={newBasePath} value={newBasePath} className="!border-none">
            <AccordionTrigger className="px-1 capitalize border-b border-accent [&_svg]:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 transition-none rounded-sm">
              {/*<span className="flex flex-row items-center gap-4 text-[15px]">
                    <div className="w-fit">
                      {values.includes(newBasePath)
                        ?
                        <FolderOpenIcon className="w-4 h-4"/>
                        :
                        <FolderClosedIcon className="w-4 h-4"/>
                      }
                    </div>
                    {dir.name}
                  </span>*/}
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
  basePath: string
}) {
  const offset = level > 0 ? '0.6rem' : 0;

  return <>
    {tree.map(file => (
      file.type === 'directory'
        ? <DirectoryTreeView key={`${basePath}/${file.path}`} slug={slug} tree={[file]} level={level + 1} basePath={basePath}/>
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

export default async function DocsTree({slug}: Props) {
  const source = await sources.getProjectSource(slug);

  const docsTree = await sources.readDocsTree(source);

  return (
    <div className="flex flex-col bg-muted rounded-md px-2 pb-2">
      <DocsSidebarTitle>
        Documentation
      </DocsSidebarTitle>

      <ModHomepageLink slug={slug}/>

      <hr className="mt-2"/>

      <div className="flex flex-col">
        <DocsFileTree slug={slug} tree={docsTree} level={0} basePath={''}/>
      </div>
    </div>
  );
}