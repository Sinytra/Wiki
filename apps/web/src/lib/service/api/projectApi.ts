import network from "@repo/shared/network";
import {ApiCallResult} from '@repo/shared/commonNetwork';
import {Project} from "@repo/shared/types/service";

export interface ProjectResponse {
  project: Project;
}

async function getAllProjectIDs(): Promise<ApiCallResult<string[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects', {userAuth: false}));
}

async function getPopularProjects(): Promise<ApiCallResult<Project[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects/popular', {cache: true, userAuth: false}));
}

async function deleteProject(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`, {method: 'DELETE'}));
}

export default {
  getAllProjectIDs,
  getPopularProjects,
  deleteProject
}
