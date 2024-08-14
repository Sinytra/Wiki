import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/docs/markdown/MarkdownContent";

export default async function Mod({ params }: { params: { slug: string } }) {
  const project = await modrinth.getProject(params.slug);

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-foreground text-2xl">{project.name}</h1>
        <hr className="mt-4 border-neutral-600" />
      </div>

      <div>
        <MarkdownContent content={project.description} />
      </div>
    </div>
  )
}