import {NextRequest} from "next/server";
import database from "@/lib/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query || query.length === 0) {
    return Response.json({ data: [] });
  }

  const available = await database.searchProjects(query);
  
  return Response.json({ data: available });
}