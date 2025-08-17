import network, {ApiCallResult} from '@repo/shared/network';
import {SystemLocale} from '@repo/shared/types/api/admin';

async function getSupportedLocales(): Promise<ApiCallResult<SystemLocale[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/locales', { userAuth: false }));
}

export default {
  getSupportedLocales
};