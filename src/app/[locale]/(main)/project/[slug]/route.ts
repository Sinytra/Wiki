import {NextRequest, NextResponse} from "next/server";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string; locale: string; }> }
) {
  const params = await props.params;
  return NextResponse.redirect(new URL(`/${params.locale}/project/${params.slug}/${DEFAULT_DOCS_VERSION}`, request.url), { status: 301 });
}