import sources from "@/lib/docs/sources";
import SidebarTitle from "@/components/docs/sidebar-title";
import DocsFileTree from "@/components/docs/docs-file-tree";
import ModHomeNav from "@/components/docs/mod-home-nav";

interface Props {
  slug: string;
}

export default async function DocsTree({slug}: Props) {
  const source = await sources.getProjectSource(slug);

  const root = '/docs/mffs'; // TODO
  const docsTree = await sources.readDocsTree(root);
  const tree = (docsTree.children || []).filter(c => c.type === 'directory' && !c.name.startsWith('.') && !c.name.startsWith('('));

  return (
    <div className="flex flex-col">
      <SidebarTitle>
        Documentation
      </SidebarTitle>

      <ModHomeNav slug={slug} />

      <hr/>

      <div className="flex flex-col">
        <DocsFileTree slug={slug} tree={tree} level={0} basePath={''}/>
      </div>
    </div>
  );
}