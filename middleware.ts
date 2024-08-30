import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import localPreview from "@/lib/docs/localPreview";
import {createI18nMiddleware} from "next-international/middleware";
import {getAvailableLocales} from "@/lib/locales/available";

const I18nMiddleware = createI18nMiddleware({
  locales: Object.keys(getAvailableLocales()),
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault'
});

const authMiddlewareWrapper = auth((req) => {
  if (req.auth) {
    return I18nMiddleware(req);
  }
});

export const config = {
  matcher: ['/((?!api|_vercel/insights|_vercel/speed-insights|_next/static|_next/image|.*\\.png$).*)'],
}

export function middleware(request: NextRequest, response: NextResponse) {
  if (localPreview.isEnabled()) {
    const resp = localPreview.previewMiddleware(request, response);
    if (resp !== null) {
      return resp;
    }
  }

  if (request.nextUrl.pathname.startsWith('/dev')) {
    return authMiddlewareWrapper(request as any, response as any);
  }

  return I18nMiddleware(request);
}