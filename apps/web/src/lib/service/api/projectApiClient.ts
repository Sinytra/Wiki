import {z} from "zod";
import {projectUpdateSourceSchema, projectRegisterSchema} from "@/lib/forms/schemas";
import commonNetwork, {ApiCallResult} from "@repo/shared/commonNetwork";
import {ProjectResponse} from "@/lib/service/api/projectApi";

async function registerProject(body: z.infer<typeof projectRegisterSchema>): Promise<ApiCallResult<ProjectResponse>> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('dev/projects', {
    body,
    includeCredentials: true
  }));
}

async function updateProject(body: z.infer<typeof projectUpdateSourceSchema>): Promise<ApiCallResult<ProjectResponse>> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('dev/projects', {
    method: 'PUT',
    body,
    includeCredentials: true
  }));
}

export default {
  registerProject,
  updateProject
}