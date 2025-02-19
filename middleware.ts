import {NextRequest, NextResponse} from "next/server";
import localPreview from "@/lib/docs/localPreview";
import createMiddleware from "next-intl/middleware";
import {routing} from "@/lib/locales/routing";
import authSession from "@/lib/authSession";

const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: ['/((?:dev|report).*|(?!api|blog|(?:en|de|fr|es|it|cs|hu|pl|ms|ms_Ar|tr|sv|uk|ru|ja|ko|zh_cn|zh_tw)(?:(?!/dev|/report)|$)|_vercel/insights|_vercel/speed-insights|_next/static|_next/image|static/.+|sinytra-wiki.schema.json|_meta.schema.json|opengraph-image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$).*)'],
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

    const authed = authSession.isAuthenticated(request.cookies);
    if (!authed) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return localResp;
  }

  return handleI18nRouting(request);
}