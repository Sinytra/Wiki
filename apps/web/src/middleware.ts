import {NextRequest, NextResponse} from "next/server";
import createMiddleware from "next-intl/middleware";
import {routing} from "@/lib/locales/routing";
import authSession from "@/lib/authSession";
import {USER_COUNTRY_COOKIE} from "@/lib/cookies";

const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: ['/((?:admin|dev|report).*|(?!api|blog|(?:en|de|fr|es|it|cs|hu|pl|ms|ms_Ar|tr|sv|uk|ru|ja|ko|zh_cn|zh_tw)(?:(?!/admin|/dev|/report)|$)|_vercel/insights|_vercel/speed-insights|_next/static|_next/image|static/.+|opengraph-image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$).*)'],
}

export async function middleware(request: NextRequest, response: NextResponse) {
  if (request.nextUrl.pathname.match(/^(\/[^/]+)?\/(?:dev|admin|report)/)) {
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

  const resp = handleI18nRouting(request);
  const countryCode = request.headers.get('x-vercel-ip-country');
  if (countryCode) {
    resp.cookies.set(USER_COUNTRY_COOKIE, countryCode, { path: "/" });
  }
  return resp;
}