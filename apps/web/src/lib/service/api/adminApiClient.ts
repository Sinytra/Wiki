import {z} from "zod";
import {updateGameDataSchema} from "@/lib/forms/schemas";
import commonNetwork, {ApiCallResult} from "@repo/shared/commonNetwork";

async function updateGameData(body: z.infer<typeof updateGameDataSchema>): Promise<ApiCallResult> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('system/import', {
    body,
    includeCredentials: true
  }));
}

export default {
  updateGameData
}