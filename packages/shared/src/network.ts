import {cookies} from "next/headers";
import env from "./env";
import envPublic from "./envPublic";
import {serializeUrlParams} from "./util";

type CallResultType = 'success' | 'redirect' | 'known_error' | 'unknown_error' | 'failed';
type ApiError = 'not_found' | 'internal' | 'unauthorized' | 'forbidden' | 'unknown';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

interface ApiCallResultBase {
  success: boolean;
  type: CallResultType;
}

interface ApiResponse extends ApiCallResultBase {
  status: number;
}

interface ApiCallException extends ApiCallResultBase {
  success: false;
  type: 'failed';
  error: 'unknown';
  message: string;
}

interface ApiUnknownErrorResponse extends ApiResponse {
  success: false;
  type: 'unknown_error';
  error: 'unknown';
  message: string;
}

interface ApiErrorResponse extends ApiResponse {
  success: false;
  type: 'known_error';
  error: ApiError;
}

interface ApiRedirectResponse extends ApiResponse {
  // Not always an error, but redirects are not wanted most of the time
  success: false;
  error: 'unknown';

  type: 'redirect';
  url: string;
}

interface ApiSuccessResponse<T> extends ApiResponse {
  success: true;
  type: 'success';
  data: T;
}

interface RequestOptions {
  method?: string;
  parameters?: Record<string, string | null>;
}

export type ApiCallResult<T = never> =
  ApiSuccessResponse<T>
  | ApiRedirectResponse
  | ApiErrorResponse
  | ApiUnknownErrorResponse
  | ApiCallException;

async function resolveApiCall<T = never>(callback: () => Promise<Response>): Promise<ApiCallResult<T>> {
  let resp: Response;
  try {
    resp = await callback();
  } catch (err) {
    console.error('Failed to call API', err);
    return {
      type: 'failed',
      success: false,
      message: err instanceof Error ? err.message : '(No message)',
      error: 'unknown'
    } satisfies ApiCallException;
  }

  const contentType = resp.headers.get(CONTENT_TYPE) || '';
  const jsonBody = contentType.includes(APPLICATION_JSON);

  if (resp.redirected) {
    return {
      type: 'redirect',
      status: resp.status,
      success: false,
      url: resp.url,
      error: 'unknown'
    } satisfies ApiRedirectResponse;
  }

  if (resp.ok) {
    const data = jsonBody ? await resp.json() : undefined;
    return {type: 'success', status: resp.status, success: true, data} satisfies ApiSuccessResponse<T>;
  }

  if (!jsonBody) {
    const body = await resp.text();
    console.error('Unexpected API response', body);
    return {
      type: 'unknown_error',
      status: resp.status,
      success: false,
      message: body,
      error: 'unknown'
    } satisfies ApiUnknownErrorResponse;
  }

  const json = await resp.json();
  const error = json.error ?? 'unknown' as ApiError;
  return {type: 'known_error', status: resp.status, success: false, error} satisfies ApiErrorResponse;
}

async function sendSimpleRequest(path: string, options?: RequestOptions) {
  const url = constructApiUrl(path, options?.parameters);

  return fetch(url, {
    method: options?.method,
    headers: {
      Authorization: `Bearer ${env.getBackendSecretApiKey()}`,
      cookie: cookies().toString()
    },
    cache: 'no-store',
  });
}

function constructApiUrl(path: string, parameters?: Record<string, string | null>): string {
  const endpoint = envPublic.getBackendEndpointUrl();
  const searchParams = serializeUrlParams(parameters);
  return `${endpoint}/api/v1/${path}?${searchParams.toString()}`;
}

const network = {
  resolveApiCall,
  sendSimpleRequest
}

export default network;