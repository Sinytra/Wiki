import sources from "@/lib/docs/sources";
import SidebarTitle from "@/components/docs/sidebar-title";

interface Props {
  slug: string;
}

export default async function DocsTree({slug}: Props) {
  const source = await sources.getProjectSource(slug);

  const docsTree = await sources.readDocsTree('/docs/mffs');

  return (
    <div className="flex flex-col">
      <SidebarTitle>
        Documentation
      </SidebarTitle>

      <div className="">
        Source: {source.id}
        <p/>
        Type: {source.type}
        <p/>
        Tree: {docsTree.filter(d => d.isDirectory()).map(d => d.name).join(',')}
      </div>
    </div>
  );
}