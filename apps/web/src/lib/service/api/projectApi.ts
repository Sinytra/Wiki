import network from "@repo/shared/network";
import {ApiCallResult} from '@repo/shared/commonNetwork';
import {Project} from "@repo/shared/types/service";

export interface ProjectResponse {
  project: Project;
}

async function getAllProjectIDs(): Promise<ApiCallResult<string[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects', {userAuth: false}));
}

async function getProjectsByID(ids: string[]): Promise<ApiCallResult<Project[]>> {
  const body = {ids};
  return network.resolveApiCall(() => network.sendDataRequest('projects/bulk', {cache: true, userAuth: false, body}));
}

async function deleteProject(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`, {method: 'DELETE'}));
}

export default {
  getAllProjectIDs,
  getProjectsByID,
  deleteProject
}
