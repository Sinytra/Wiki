import database from "@/lib/database";
import {redirect, RedirectType} from "next/navigation";
import ModInfo from "@/components/docs/mod-info";
import modrinth from "@/lib/modrinth";
import DocsTree from "@/components/docs/docs-tree";

export default async function ModLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: { slug: string }
}>) {
  const dbProject = await database.getProject(params.slug);

  if (dbProject == null) {
    redirect('/', RedirectType.replace);
  }

  const project = await modrinth.getProject(params.slug);

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0">
        <DocsTree slug={project.slug}/>
      </aside>
      <div className="w-full max-w-3xl">
        {children}
      </div>
      <aside className="w-64 flex-shrink-0">
        <ModInfo mod={project}/>
      </aside>
    </div>
  );
}