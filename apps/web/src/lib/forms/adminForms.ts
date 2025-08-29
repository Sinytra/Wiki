'use server'

import adminApi from "@/lib/service/api/adminApi";
import {ApiCallResult} from '@repo/shared/commonNetwork';

export async function handleDataMigration(id: string): Promise<ApiCallResult> {
  return await adminApi.runDataMigration(id);
}