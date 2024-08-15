import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/docs/markdown/MarkdownContent";
import sources from "@/lib/docs/sources";
import {Badge} from "@/components/ui/badge";

export default async function Mod({ params }: { params: { slug: string } }) {
  const project = await modrinth.getProject(params.slug);
  const isLocal = await sources.isLocalSource(project.slug);

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-foreground text-2xl">{project.name}</h1>
          {isLocal && <Badge variant="destructive">Local</Badge>}
        </div>
        <hr className="mt-4 mb-6 border-neutral-600"/>
      </div>

      <div>
        <MarkdownContent content={project.description} />
      </div>
    </div>
  )
}