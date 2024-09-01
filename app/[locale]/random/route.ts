import {redirect} from "next/navigation";
import database from "@/lib/database";

export async function GET(request: Request) {
  const id = await database.getRandomProjectID();

  return redirect(id === null ? '/browse' : `/mod/${id}`);
}