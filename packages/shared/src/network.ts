import env from '@repo/shared/env';
import {cookies} from 'next/headers';
import commonNetwork, {ApiCallResult, RequestOptions} from '@repo/shared/commonNetwork';

async function resolveApiCall<T = never>(callback: () => Promise<Response>): Promise<ApiCallResult<T>> {
  return commonNetwork.resolveApiCall(callback);
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
  const headers: any = {
    ...options?.headers,
    Authorization: `Bearer ${env.getBackendSecretApiKey()}`
  };
  if (options?.userAuth === true || options?.userAuth === undefined) {
    headers.cookie = (await cookies()).toString();
  }

  return commonNetwork.sendSimpleRequest(path, {...options, headers});
}

export default {
  sendDataRequest,
  sendSimpleRequest,
  resolveApiCall
};