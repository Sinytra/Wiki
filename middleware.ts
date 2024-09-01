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

export const config = {
  matcher: ['/((?!api|_vercel/insights|_vercel/speed-insights|_next/static|_next/image|favicon.ico|sitemap.xml|.*\\.png$).*)'],
}

export async function middleware(request: NextRequest, response: NextResponse) {
  if (localPreview.isEnabled()) {
    const resp = localPreview.previewMiddleware(request, response);
    if (resp !== null) {
      return resp;
    }
  }

  if (request.nextUrl.pathname.match(/^(\/[^\/]+)?\/dev/)) {
    const localResp = I18nMiddleware(request);
    if (localResp.status !== 200) {
      return localResp;
    }

    const resp = await auth(request as any, response as any) as any;
    localResp.headers.forEach((val, key) => resp.headers.set(key, val));
    // @ts-ignore
    resp.cookies = localResp.cookies;
    return resp;
  }

  return I18nMiddleware(request);
}