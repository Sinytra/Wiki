import {NextRequest} from "next/server";
import modrinth from "@/lib/platforms/modrinth";
import database from "@/lib/database";
import {ModSearchResult} from "@/lib/types/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query) {
    return Response.json({ data: [] });
  }

  const projects = await modrinth.searchProjects(query);
  const available = await database.getProjectStatuses(projects.map(p => p.slug));
  const active = projects.filter(p => available.includes(p.slug));
  const results: ModSearchResult[] = active.map(p => ({ id: p.slug, name: p.name, description: p.description, icon_url: p.icon_url }))

  return Response.json({ data: results });
}