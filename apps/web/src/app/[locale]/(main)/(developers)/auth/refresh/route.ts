import {NextRequest, NextResponse} from "next/server";
import {SESSION_KEY} from "@/lib/authSession";
import {cookies} from "next/headers";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl));

  const store = await cookies();
  store.delete({ name: SESSION_KEY, domain: process.env.AUTH_COOKIE_DOMAIN });

  return response;
}