import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/lib/auth";
import localPreview from "@/lib/docs/localPreview";
import createMiddleware from "next-intl/middleware";
import {routing} from "@/lib/locales/routing";

const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: ['/((?:dev|report).*|(?!api|blog|(?:en|de|fr|es|it|cs|hu|pl|sv|uk|ru|ja|ko|zh_cn|zh_tw)(?:(?!/dev|/report)|$)|_vercel/insights|_vercel/speed-insights|_next/static|_next/image|sinytra-wiki.schema.json|_meta.schema.json|opengraph-image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$).*)'],
}

export async function middleware(request: NextRequest, response: NextResponse) {
  console.log('invoking middleware', request.nextUrl.pathname);

  if (localPreview.isEnabled()) {
    const resp = localPreview.previewMiddleware(request, response);
    if (resp !== null) {
      return resp;
    }
  }

  if (request.nextUrl.pathname.match(/^(\/[^\/]+)?\/(?:dev|report)/)) {
    const localResp = handleI18nRouting(request);
    if (localResp.status !== 200) {
      return localResp;
    }

    const resp = await auth(request as any, response as any) as any;
    localResp.headers.forEach((val, key) => resp.headers.set(key, val));
    // @ts-ignore
    resp.cookies = localResp.cookies;
    return resp;
  }

  return handleI18nRouting(request);
}