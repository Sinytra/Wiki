import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import env from '@repo/shared/env';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.nextUrl));

  const store = await cookies();
  const sessionKey = env.getSessionCookieName();
  store.delete({ name: sessionKey, domain: process.env.AUTH_COOKIE_DOMAIN });

  return response;
}
