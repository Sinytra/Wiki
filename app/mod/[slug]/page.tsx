import modrinth from "@/lib/modrinth";
import MarkdownContent from "@/components/markdown/MarkdownContent";
import database from "@/lib/database";
import {redirect, RedirectType} from "next/navigation";

export default async function Mod({ params }: { params: { slug: string } }) {
  const project = await database.getProject(params.slug);

  if (project == null) {
    redirect('/', RedirectType.replace);
  }

  const data = await modrinth.getProject(params.slug);

  return (
    <div>
      <MarkdownContent content={data.description} />
    </div>
  )
}