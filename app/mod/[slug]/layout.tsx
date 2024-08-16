import database from "@/lib/database";
import {redirect, RedirectType} from "next/navigation";

export default async function ModLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: { slug: string }
}>) {
  const dbProject = await database.getProject(params.slug);

  if (dbProject == null) {
    redirect('/', RedirectType.replace);
  }

  return <>{children}</>;
}