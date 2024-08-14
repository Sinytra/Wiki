import {signOut} from "@/lib/auth";
import {revalidatePath} from "next/cache";

export async function GET() {
  revalidatePath('/');  
  await signOut({ redirectTo: '/' });
}