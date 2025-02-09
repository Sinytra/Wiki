import {NextRequest, NextResponse} from "next/server";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";

export async function GET(request: NextRequest, { params }: { params: { slug: string; locale: string; } }) {
  return NextResponse.redirect(new URL(`/${params.locale}/project/${params.slug}/${DEFAULT_DOCS_VERSION}`, request.url), { status: 301 });
}