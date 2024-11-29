import {NextRequest, NextResponse} from "next/server";

// Backwards compat only
export async function GET(request: NextRequest, { params }: { params: { locale: string; path: string[] } }) {
  return NextResponse.redirect(new URL(`/project/${params.path.join('/')}`, request.url), { status: 301 });
}