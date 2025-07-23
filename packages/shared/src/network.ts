import {cookies} from "next/headers";
import env from "./env";
import envPublic from "./envPublic";
import {serializeUrlParams} from "./util";
import locales from "@repo/shared/lang/locales";
import {DEFAULT_DOCS_VERSION} from "./constants";

type CallResultType = 'success' | 'redirect' | 'known_error' | 'unknown_error' | 'failed';
type ApiError = 'not_found' | 'internal' | 'unauthorized' | 'forbidden' | 'unknown';

const CONTENT_TYPE = 'content-type';
const APPLICATION_JSON = 'application/json';

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

export type ApiRouteParameters = Record<string, string | undefined | null>;

interface ApiCallResultBase {
  success: boolean;
  type: CallResultType;
}

interface ApiResponse extends ApiCallResultBase {
  status: number;
}

export interface ApiCallException extends ApiCallResultBase {
  success: false;
  type: 'failed';
  error: 'unknown';
  message: string;
}

export interface ApiUnknownErrorResponse extends ApiResponse {
  success: false;
  type: 'unknown_error';
  error: 'unknown';
  message: string;
}

export interface ApiErrorResponse extends ApiResponse {
  success: false;
  type: 'known_error';
  error: ApiError;
  data: unknown;
}

export interface ApiRedirectResponse extends ApiResponse {
  // Not always an error, but redirects are not wanted most of the time
  success: false;
  error: 'unknown';

  type: 'redirect';
  url: string;
}

export interface ApiSuccessResponse<T> extends ApiResponse {
  success: true;
  type: 'success';
  data: T;
}

export interface RequestOptions {
  method?: string;
  parameters?: ApiRouteParameters;
  cache?: boolean | NextFetchRequestConfig;
  headers?: HeadersInit;
  body?: any;
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

  if (resp.status >= 300 && resp.status < 400) {
    return {
      type: 'redirect',
      status: resp.status,
      success: false,
      url: resp.headers.get('location') || '',
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
  return {type: 'known_error', status: resp.status, success: false, data: json, error} satisfies ApiErrorResponse;
}

async function sendDataRequest(path: string, options?: RequestOptions) {
  return sendSimpleRequest(path, {
    method: 'POST',
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json'
    },
    cache: false
  });
}

async function sendSimpleRequest(path: string, options?: RequestOptions) {
  const url = constructApiUrl(path, options?.parameters);
  const useCache = options?.cache === true || typeof options?.cache === 'object';

  return fetch(url, {
    method: options?.method,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${env.getBackendSecretApiKey()}`,
      cookie: (await cookies()).toString()
    },
    body: options?.body ? (typeof options?.body === 'string' ? options.body : JSON.stringify(options.body)) : null,
    cache: useCache ? 'force-cache' : undefined,
    next: useCache ? {
      tags: typeof options.cache == 'object' ? options.cache.tags : undefined,
      revalidate: (typeof options.cache == 'object' ? options.cache.revalidate : undefined) || ONE_WEEK
    } : undefined,
    redirect: 'manual'
  });
}

function preprocessParam(key: string, value: string): string | null {
  if (key == 'locale') {
    return locales.actualLocale(value);
  }
  if (key == 'version') {
    return actualVersion(value);
  }
  return value;
}

function constructApiUrl(path: string, parameters?: ApiRouteParameters): string {
  const endpoint = envPublic.getBackendEndpointUrl();
  const searchParams = serializeUrlParams(parameters, preprocessParam);
  return `${endpoint}/api/v1/${path}?${searchParams}`;
}

function actualVersion(version: string | null): string | null {
  return version == DEFAULT_DOCS_VERSION ? null : version;
}

export default {
  resolveApiCall,
  sendSimpleRequest,
  sendDataRequest,
  constructApiUrl,
  actualVersion
}
