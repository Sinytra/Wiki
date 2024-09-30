import {redirect} from "next/navigation";
import database from "@/lib/database";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: {params: { locale: string }}) {
  const id = await database.getRandomProjectID();
  const locale = context.params.locale || 'en';

  return redirect(id === null ? `/${locale}/browse` : `/${locale}/mod/${id}`);
}