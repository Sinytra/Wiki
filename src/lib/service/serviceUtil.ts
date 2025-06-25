import authSession from "@/lib/authSession";
import {Language} from "@/lib/types/available";
import available from "@/lib/locales/available";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@repo/shared/constants";
import {ApiCallResult} from "@repo/shared/network";
import {notFound} from "next/navigation";
import {getParams} from "@nimpl/getters/get-params";
import {redirect} from "@/lib/locales/routing";

export function handleApiCall<T>(result: ApiCallResult<T>, returnTo?: string): T {
  // Success
  if (result.type == 'success') {
    return result.data;
  }

  // Failed to execute
  if (result.type == 'failed') {
    throw new Error("Failed to execute API call: " + result.message);
  }

  if (result.status === 401) {
    authSession.refresh();
    // @ts-ignore
    return undefined;
  }

  if (result.status === 404) {
    if (returnTo) {
      const params = getParams() as any;
      redirect({href: returnTo, locale: params.locale});
    } else {
      // TODO Not found pages
      notFound();
    }
  }

  // Backend returned non-JSON
  if (result.type == 'unknown_error') {
    throw new Error(`Unexpected response status: ${result.status}, message: ${result.message}`);
  }

  // Redirected
  if (result.type == 'redirect') {
    throw new Error("Unexpected redirect from API call to URL: " + result.url);
  }

  // Backend returned JSON
  throw new Error(`API call returned error: ${result.error}`);
}

export function constructPagePath(path: string[]) {
  return path.join('/');
}

// TODO Automatic handling
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