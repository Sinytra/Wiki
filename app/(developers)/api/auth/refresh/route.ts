import {signOut} from "@/lib/auth";

export async function GET(request: Request) {
  return await signOut({ redirectTo: '/auth/login' });
}