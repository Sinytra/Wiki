import {DataImports, DataMigration, SystemInfo} from "@repo/shared/types/api/admin";
import network, {ApiCallResult, ApiRouteParameters} from "@repo/shared/network";

async function getSystemInfo(parameters: ApiRouteParameters): Promise<ApiCallResult<SystemInfo>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/info', { parameters }));
}

async function getDataImports(parameters: ApiRouteParameters): Promise<ApiCallResult<DataImports>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/imports', { parameters }));
}

async function getDataMigrations(): Promise<ApiCallResult<DataMigration[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/migrations'));
}

async function runDataMigration(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`system/migrate/${id}`, { method: 'POST' }));
}

export default {
  getSystemInfo,
  getDataImports,
  getDataMigrations,
  runDataMigration
}
