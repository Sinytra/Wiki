import {NextRequest} from "next/server";
import {cookies} from 'next/headers';
import {redirect} from "next/navigation";
import {assertBackendUrl} from "@/lib/service/remoteServiceApi";

export const SESSION_KEY = 'sessionid';

interface Session {
  token: string;
}

function isAuthenticated(cookies: NextRequest['cookies']) {
  return cookies.has(SESSION_KEY);
}

function getSession(): Session | null {
  const store = cookies();
  const result = store.get(SESSION_KEY);
  return result ? { token: result.value } : null;
}

function login() {
  const backendUrl = assertBackendUrl();

  redirect(`${backendUrl}/api/v1/auth/login`);
}

function logout() {
  const backendUrl = assertBackendUrl();

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