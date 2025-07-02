import {NextRequest} from "next/server";
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import {redirect} from "next/navigation";
import envPublic from "@repo/shared/envPublic";

export const SESSION_KEY = 'sessionid';

interface Session {
  token: string;
}

function isAuthenticated(cookies: NextRequest['cookies']) {
  return cookies.has(SESSION_KEY);
}

function getSession(): Session | null {
  const store = (cookies() as unknown as UnsafeUnwrappedCookies);
  const result = store.get(SESSION_KEY);
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
}