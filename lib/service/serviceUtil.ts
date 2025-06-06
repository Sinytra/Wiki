import {StatusResponse} from "@/lib/service/index";
import authSession from "@/lib/authSession";

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
