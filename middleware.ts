import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import localPreview from "@/lib/docs/localPreview";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export function middleware(request: NextRequest, response: NextResponse) {
  if (localPreview.isEnabled()) {
    const resp = localPreview.previewMiddleware(request, response);
    if (resp !== null) {
      return resp;
    }
  }

  if (request.nextUrl.pathname.startsWith('/dev')) {
    return auth(request as any, response as any);
  }

  return NextResponse.next();
}