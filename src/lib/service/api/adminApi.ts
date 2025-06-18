import {DataImports, SystemInfo} from "@repo/shared/types/api/admin";
import network, {ApiCallResult, ApiRouteParameters} from "@repo/shared/network";

async function getSystemInfo(parameters: ApiRouteParameters): Promise<ApiCallResult<SystemInfo>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/info', { parameters }));
}

async function getDataImports(parameters: ApiRouteParameters): Promise<ApiCallResult<DataImports>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/imports', { parameters }));
}

export default {
  getSystemInfo,
  getDataImports
}
