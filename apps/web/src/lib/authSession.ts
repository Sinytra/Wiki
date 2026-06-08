import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import envPublic from '@repo/shared/envPublic';
import env from '@repo/shared/env';

interface Session {
  token: string;
}

function isAuthenticated(cookies: NextRequest['cookies']) {
  return cookies.has(env.getSessionCookieName());
}

async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const result = store.get(env.getSessionCookieName());
  return result ? { token: result.value } : null;
}

function login() {
  const backendUrl = envPublic.getBackendEndpointUrl();

  redirect(`${backendUrl}/api/v1/auth/login`);
}

function logout() {
  const backendUrl = envPublic.getBackendEndpointUrl();

  redirect(`${backendUrl}/api/v1/auth/logout`);
}

function refresh() {
  redirect('/auth/refresh');
}

export default {
  isAuthenticated,
  getSession,
  login,
  logout,
  refresh
};
