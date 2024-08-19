import {NextRequest} from "next/server";
import database from "@/lib/database";
import {ModSearchResult} from "@/lib/types/search";
import {ModProject} from "@/lib/platforms";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query) {
    return Response.json({ data: [] });
  }

  const projects: ModProject[] = []; // TODO Implement search
  const available = await database.getProjectStatuses(projects.map(p => p.slug));
  const active = projects.filter(p => available.includes(p.slug));
  const results: ModSearchResult[] = active.map(p => ({ id: p.slug, name: p.name, description: p.description, icon_url: p.icon_url }))

  return Response.json({ data: results });
}