import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import cacheUtil from "@/lib/cacheUtil";
import {
  DeploymentInfo,
  PaginatedData, DevProjectData,
  ProjectFlag,
  ProjectMembersData,
  UserProjectsResponse
} from "@sinytra/wiki-api-types";
import {z} from "zod";
import {addProjectMemberSchema, projectUpdateSchema, removeProjectMemberSchema} from "@/lib/forms/schemas";
import {
  DevProjectVersions,
  ProjectContentPages,
  ProjectContentRecipes,
  ProjectContentTags,
} from "@repo/shared/types/service";

async function getProjects(): Promise<ApiCallResult<UserProjectsResponse>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('dev/projects'));
}

async function getProject(id: string): Promise<ApiCallResult<DevProjectData>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`));
}

async function updateProject(projectId: string, body: z.infer<typeof projectUpdateSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${projectId}`, { method: 'PUT' , body}));
}

async function getProjectDeployments(projectId: string, parameters: ApiRouteParameters): Promise<ApiCallResult<PaginatedData<DeploymentInfo>>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/deployments`, {parameters}));
}

async function getDeployment(projectId: string, deploymentId: string): Promise<ApiCallResult<DeploymentInfo>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/deployments/${deploymentId}`));
}

async function deployProject(id: string, token: string | null = null): Promise<ApiCallResult> {
  return await network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/deploy`, { method: 'POST', parameters: {token}}));
}

async function deleteDeployment(projectId: string, deploymentId: string): Promise<ApiCallResult<DeploymentInfo>> {
  const result = await network.resolveApiCall<DeploymentInfo>(
    () => network.sendSimpleRequest(`dev/projects/${projectId}/deployments/${deploymentId}`, {method: 'DELETE'}));
  if (result.success && result.data.active) {
    cacheUtil.invalidateDocs(result.data.project_id);
  }
  return result;
}

async function removeProjectFlag(projectId: string, flag: ProjectFlag): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/flags/${flag}`, { method: 'DELETE'}));
}

async function getProjectMembers(projectId: string): Promise<ApiCallResult<ProjectMembersData>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/members`))
}

async function addProjectMember(projectId: string, body: z.infer<typeof addProjectMemberSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${projectId}/members`, {body}))
}

async function removeProjectMember(projectId: string, body: z.infer<typeof removeProjectMemberSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${projectId}/members`, {method: 'DELETE', body}))
}

async function getProjectVersions(projectId: string, parameters: ApiRouteParameters): Promise<ApiCallResult<DevProjectVersions>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/versions`, {parameters}))
}

async function getProjectContentPages(id: string, parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectContentPages>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/content/pages`, {parameters}))
}

async function getProjectContentTags(id: string, parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectContentTags>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/content/tags`, {parameters}))
}

async function getProjectContentTagItems(id: string, tag: string, parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectContentPages>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/content/tags/${tag}`, {parameters}));
}

async function getProjectContentRecipes(id: string, parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectContentRecipes>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/content/recipes`, {parameters}));
}

export default {
  getProjects,
  getProject,
  updateProject,
  getProjectDeployments,
  getDeployment,
  deployProject,
  deleteDeployment,
  getProjectVersions,
  getProjectContentPages,
  getProjectContentTags,
  getProjectContentTagItems,
  getProjectContentRecipes,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  removeProjectFlag
};
