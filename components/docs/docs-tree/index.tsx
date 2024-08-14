import sources from "@/lib/docs/sources";

interface Props {
  slug: string;
}

export default async function DocsTree({slug}: Props) {
  const source = await sources.getProjectSource(slug);

  const docsTree = await sources.readFileTree('/docs/mffs');
  
  return (
    <div>
      Source: {source.id}
      <p/>
      Type: {source.type}
      <p/>
      Tree: {docsTree.filter(d => d.isDirectory()).map(d => d.name).join(',')}
    </div>
  );
}