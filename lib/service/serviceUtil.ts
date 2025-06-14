import {StatusResponse} from "@/lib/service/index";
import authSession from "@/lib/authSession";
import {Language} from "@/lib/types/available";
import available from "@/lib/locales/available";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@/lib/constants";

export function handleApiResponse<T extends object>(response: T | StatusResponse): T {
  if ('status' in response) {
    if (response.status === 401) {
      authSession.refresh();
      // @ts-ignore
      return undefined;
    }
    throw new Error("Unexpected response status: " + response.status);
  }
  return response;
}

export function constructPagePath(path: string[]) {
  return path.join('/');
}

export function actualVersion(version: string | null): string | null {
  return version == DEFAULT_DOCS_VERSION ? null : version;
}

export function actualLocale(locale: string | null): string | null {
  return !locale || locale == DEFAULT_LOCALE ? null : getLocaleName(locale);
}

function getLocaleName(locale: string) {
  const loc: Language = available.getForUrlParam(locale);
  return loc.prefix ? loc.prefix : `${locale}_${locale}`;
}