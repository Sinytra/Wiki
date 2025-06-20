import {getParams} from "@nimpl/getters/get-params";

export function trimText(str: string, len: number) {
  return str.length > len ? `${str.substring(0, len)}...` : str;
}

export function getHttpErrorDetailsURL(status: number): string {
  return `https://http.cat/${status}`;
}

export function getProcessURL(): string {
  return process.env.NEXT_PUBLIC_NEXT_APP_URL || 'http://localhost:3000';
}

export async function resolveSoft<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (e) {
    return null;
  }
}

export interface ProjectCoordinates {
  locale: string;
  slug: string;
  version: string;
}

export interface ProjectContentCoordinates extends ProjectCoordinates{
  id: string;
}

export function getProjectParams(): ProjectCoordinates {
  return getTypedParams('locale', 'slug', 'version');
}

export function getProjectContentParams(): ProjectContentCoordinates {
  return getTypedParams('locale', 'slug', 'version', 'id');
}

function getTypedParams<T>(...keys: string[]): T {
  const params = getParams() || {};
  for (const s of keys) {
    if (!(s in params)) {
      throw new Error('Params missing expected property ' + s)
    }
  }
  return (params as unknown) as T;
}