import {redirect} from "next/navigation";
import database from "@/lib/database";

export async function GET(request: Request, params: { locale: string }) {
  const id = await database.getRandomProjectID();
  const locale = params.locale || 'en';

  return redirect(id === null ? `/${locale}/browse` : `/${locale}/mod/${id}`);
}