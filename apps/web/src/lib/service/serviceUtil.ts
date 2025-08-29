import authSession from "@/lib/authSession";
import {ApiCallResult} from "@repo/shared/commonNetwork";
import {notFound, redirect} from "next/navigation";

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
    // @ts-expect-error refresh will redirect
    return undefined;
  }

  if (result.status === 404) {
    if (returnTo) {
      redirect(returnTo);
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
