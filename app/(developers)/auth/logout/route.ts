import {redirect} from "next/navigation";
import {signOut} from "@/lib/auth";

export async function GET() {
  await signOut();

  redirect('/');
}