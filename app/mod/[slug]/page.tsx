import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/markdown/MarkdownContent";

export default async function Mod({ params }: { params: { slug: string } }) {
  const data = await modrinth.getProject(params.slug);

  return (
    <div>
      <p>My Post: {params.slug}</p>
      
      <p>The Project: {data.title}</p>
      
      <MarkdownContent content={data.body} />
    </div>
  )
}