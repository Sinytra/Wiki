import {sendSimpleRequest, wrapJsonServiceCall} from "../remoteServiceApi";

import {StatusResponse} from "@repo/shared/types/service";
import {DataImports, SystemInfo} from "@repo/shared/types/api/admin";

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