import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string; locale: string; } }) {
  return NextResponse.redirect(new URL(`/${params.locale}/project/${params.slug}/docs`, request.url), { status: 301 });
}