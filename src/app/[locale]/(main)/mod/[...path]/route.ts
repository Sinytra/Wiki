import {NextRequest, NextResponse} from "next/server";

// Backwards compat only
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ locale: string; path: string[] }> }
) {
  const params = await props.params;
  return NextResponse.redirect(new URL(`/project/${params.path.join('/')}`, request.url), { status: 301 });
}