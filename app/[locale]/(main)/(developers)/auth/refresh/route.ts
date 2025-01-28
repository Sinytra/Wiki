import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {SESSION_KEY} from "@/lib/authSession";

export async function GET(req: Request) {
  cookies().delete(SESSION_KEY);

  return redirect('/auth/login');
}