import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  return NextResponse.redirect(new URL(`/mod/${params.slug}/docs`, request.url), { status: 301 });
}