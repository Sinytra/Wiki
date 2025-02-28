import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/about/overview', request.url), { status: 301 });
}