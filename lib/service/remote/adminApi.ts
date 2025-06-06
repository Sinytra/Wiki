import {sendSimpleRequest, wrapJsonServiceCall} from "../remoteServiceApi";
import {PaginatedData, StatusResponse} from "@/lib/service";

export interface DataImport {
  id: number;
  game_version: string;
  loader: string;
  loader_version: string;
  user_id: string;
  created_at: string;
}
export type DataImports = PaginatedData<DataImport>;

export interface SystemStats {
  projects: number;
  users: number;
}

export interface SystemInfo {
  version: string;
  version_hash: string;
  latest_data: DataImport;
  stats: SystemStats;
}

async function getSystemInfo(params: Record<string, string | null>): Promise<SystemInfo | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`system/info`, params, 'GET'));
}

async function getDataImports(params: Record<string, string | null>): Promise<DataImports | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`system/imports`, params, 'GET'));
}

export default {
  getSystemInfo,
  getDataImports
}