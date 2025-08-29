import {z} from "zod";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import commonNetwork, {ApiCallResult} from "@repo/shared/commonNetwork";
import {ProjectResponse} from "@/lib/service/api/projectApi";

async function registerProject(body: z.infer<typeof projectRegisterSchema>): Promise<ApiCallResult<ProjectResponse>> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('dev/projects', {
    body,
    includeCredentials: true
  }));
}

export default {
  registerProject
}