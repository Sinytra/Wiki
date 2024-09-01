import {NextRequest} from "next/server";
import database from "@/lib/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  if (!query || query.length === 0) {
    return Response.json({ data: [] });
  }

  const available = await database.searchProjects(query);

  await new Promise((res) => {
    setTimeout(() => res(null), 2000);
  })
  
  return Response.json({ data: [...available, ...available, ...available, ...available, ...available, ...available] });
}