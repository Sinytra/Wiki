import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/markdown/MarkdownContent";

export default async function Mod({ params }: { params: { slug: string } }) {
  const data = await modrinth.getProject(params.slug);

  return (
    <div>
      <MarkdownContent content={data.body} />
    </div>
  )
}