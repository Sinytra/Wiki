// noinspection JSUnusedLocalSymbols

import {NextRequest, NextResponse} from "next/server";

function previewMiddleware(request: NextRequest, response: NextResponse): NextResponse | null {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/preview') && !path.startsWith('/project')) {
    return NextResponse.redirect(new URL('/preview', request.url), { status: 307 });
  }
  return null;
}

export default {
  previewMiddleware
}