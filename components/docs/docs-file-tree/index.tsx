import {DirectoryTree} from "directory-tree";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import LinkTextButton from "@/components/ui/link-text-button";
import {Button} from "@/components/ui/button";
import {HomeIcon} from "lucide-react";

function DirectoryTreeView({slug, tree, level, basePath}: {
  slug: string;
  tree: DirectoryTree[];
  level: number;
  basePath: string
}) {
  if (tree.length === 0) {
    return <></>
  }

  const defaultValues = tree.map(dir => `${basePath}/${dir.name}`);
  // const [values, setValues] = useState<string[]>([]);

  return (
    <Accordion defaultValue={defaultValues} type="multiple" style={{marginLeft: `${(level * 0.5)}rem`}} /*onValueChange={setValues}*/>
      {tree.map(dir => {
        const newBasePath = `${basePath}/${dir.name}`;
        return (
          <AccordionItem key={newBasePath} value={newBasePath} className="!border-none">
            <AccordionTrigger className="capitalize border-b border-accent [&_svg]:text-muted-foreground">
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

export default function DocsFileTree({slug, tree, level, basePath}: {
  slug: string;
  tree: DirectoryTree[];
  level: number;
  basePath: string
}) {
  const availableDirs = tree.filter(t => t.type === 'directory' && t.children);
  const availableFiles = tree.filter(t => t.type === 'file');
  
  return <>
    <DirectoryTreeView slug={slug} tree={availableDirs} level={level} basePath={basePath}/>

    {availableFiles.map(file => (
      <div key={`${basePath}/${file.name}`} className="capitalize ml-[0.75rem] w-full pt-4 px-1">
        <LinkTextButton href={`/mod/${slug}/docs${basePath}/${file.name.split('.')[0]}`}>
          {file.name.split('.')[0].replace('_', ' ')}
        </LinkTextButton>
      </div>
    ))}
  </>
}