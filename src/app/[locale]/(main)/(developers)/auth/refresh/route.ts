import {NextRequest, NextResponse} from "next/server";
import {SESSION_KEY} from "@/lib/authSession";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  const domain = request.nextUrl.hostname;
  response.headers.set('Set-Cookie', `${SESSION_KEY}=; Path=/; Max-Age=0; Domain=${domain}`);
  return response;
}