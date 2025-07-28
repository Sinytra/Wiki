import network, {ApiCallResult} from "@repo/shared/network";
import {Project} from "@repo/shared/types/service";
import {z} from "zod";
import {projectEditSchema, projectRegisterSchema} from "@/lib/forms/schemas";

export interface ProjectResponse {
  project: Project;
}

async function getAllProjectIDs(): Promise<ApiCallResult<string[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects', {userAuth: false}));
}

async function getPopularProjects(): Promise<ApiCallResult<Project[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects/popular', {cache: true, userAuth: false}));
}

async function registerProject(body: z.infer<typeof projectRegisterSchema>): Promise<ApiCallResult<ProjectResponse>> {
  return network.resolveApiCall(() => network.sendDataRequest('dev/projects', {body}));
}

async function updateProject(body: z.infer<typeof projectEditSchema>): Promise<ApiCallResult<ProjectResponse>> {
  return network.resolveApiCall(() => network.sendDataRequest('dev/projects', {method: 'PUT', body}));
}

async function deleteProject(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`, {method: 'DELETE'}));
}

export default {
  getAllProjectIDs,
  getPopularProjects,
  registerProject,
  updateProject,
  deleteProject
}
