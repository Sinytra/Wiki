import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {getParams} from "@nimpl/getters/get-params";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function getProjectParams(): ProjectCoordinates {
  const params = getParams() || {};
  for (const s of ['locale', 'slug', 'version']) {
    if (!(s in params)) {
      throw new Error('Params missing expected property ' + s)
    }
  }
  return (params as unknown) as ProjectCoordinates;
}