import {
  AdminProjectInfo,
  CreateAccessKeyResponse,
  DataImportInfo,
  AccessKeyInfo,
  PaginatedData,
  SystemInfoResponse, DataMigration
} from '@sinytra/wiki-api-types';
import network from '@repo/shared/network';
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {z} from 'zod';
import {createAccessKeySchema} from '@/lib/forms/schemas';

async function getSystemInfo(parameters: ApiRouteParameters): Promise<ApiCallResult<SystemInfoResponse>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/info', {parameters}));
}

async function getDataImports(parameters: ApiRouteParameters): Promise<ApiCallResult<PaginatedData<DataImportInfo>>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/imports', {parameters}));
}

async function getDataMigrations(): Promise<ApiCallResult<DataMigration[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/migrations'));
}

async function runDataMigration(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`system/migrate/${id}`, {method: 'POST'}));
}

async function getAccessKeys(parameters: ApiRouteParameters): Promise<ApiCallResult<PaginatedData<AccessKeyInfo>>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/keys', {parameters}));
}

async function createAccessKey(body: z.infer<typeof createAccessKeySchema>): Promise<ApiCallResult<CreateAccessKeyResponse>> {
  return network.resolveApiCall(() => network.sendDataRequest('system/keys', {body}));
}

async function deleteAccessKey(id: number): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`system/keys/${id}`, {method: 'DELETE'}));
}

async function getAllProjects(parameters: ApiRouteParameters): Promise<ApiCallResult<PaginatedData<AdminProjectInfo>>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('system/projects', {parameters}));
}

export default {
  getSystemInfo,
  getDataImports,
  getDataMigrations,
  runDataMigration,
  getAccessKeys,
  createAccessKey,
  deleteAccessKey,
  getAllProjects
};
