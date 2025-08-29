import {AccessKey, AccessKeys, DataImports, DataMigration, SystemInfo} from "@repo/shared/types/api/admin";
import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {z} from "zod";
import {createAccessKeySchema} from "@/lib/forms/schemas";

export interface AccessKeyCreationResult {
  key: AccessKey;
  token: string;
}

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

async function getAccessKeys(parameters: ApiRouteParameters): Promise<ApiCallResult<AccessKeys>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/keys', { parameters }));
}

async function createAccessKey(body: z.infer<typeof createAccessKeySchema>): Promise<ApiCallResult<AccessKeyCreationResult>> {
  return network.resolveApiCall(() => network.sendDataRequest('system/keys', { body }));
}

async function deleteAccessKey(id: number): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`system/keys/${id}`, {method: 'DELETE'}));
}

export default {
  getSystemInfo,
  getDataImports,
  getDataMigrations,
  runDataMigration,
  getAccessKeys,
  createAccessKey,
  deleteAccessKey
}
