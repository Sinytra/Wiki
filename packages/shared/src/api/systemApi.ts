import network from '@repo/shared/network';
import {ApiCallResult} from '@repo/shared/commonNetwork';
import {LocaleInfo} from '@sinytra/wiki-api-types';

async function getSupportedLocales(): Promise<ApiCallResult<LocaleInfo[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/locales', { userAuth: false }));
}

export default {
  getSupportedLocales
};