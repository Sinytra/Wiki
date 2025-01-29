import {NextRequest, NextResponse} from "next/server";
import {SESSION_KEY} from "@/lib/authSession";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  response.cookies.delete(SESSION_KEY);
  return response;
}