import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {DevProject} from "@repo/shared/types/service";
import cacheUtil from "@/lib/cacheUtil";
import {
  DevProjectDeployments,
  FullDevProjectDeployment,
  PartialDevProjectDeployment
} from "@repo/shared/types/api/deployment";
import {UserProfile} from "@repo/shared/types/api/auth";
import {
  ProjectContentPages,
  ProjectContentRecipes,
  ProjectContentTags,
  ProjectMembersData,
  ProjectVersions
} from "@repo/shared/types/api/devProject";
import {z} from "zod";
import {addProjectMemberSchema, projectUpdateSchema, removeProjectMemberSchema} from "@/lib/forms/schemas";

export interface DevProjectsOverview {
  profile: UserProfile;
  projects: DevProject[];
}

async function getProjects(): Promise<ApiCallResult<DevProjectsOverview>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('dev/projects'));
}

async function getProject(id: string): Promise<ApiCallResult<DevProject>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`));
}

async function updateProject(projectId: string, body: z.infer<typeof projectUpdateSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${projectId}`, { method: 'PUT' , body}));
}

async function getProjectDeployments(projectId: string, parameters: ApiRouteParameters): Promise<ApiCallResult<DevProjectDeployments>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/deployments`, {parameters}));
}

async function getDeployment(id: string): Promise<ApiCallResult<FullDevProjectDeployment>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/deployments/${id}`));
}

async function deployProject(id: string, token: string | null = null): Promise<ApiCallResult> {
  return await network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}/deploy`, { method: 'POST', parameters: {token}}));
}

async function deleteDeployment(id: string): Promise<ApiCallResult<PartialDevProjectDeployment>> {
  const result = await network.resolveApiCall<PartialDevProjectDeployment>(() => network.sendSimpleRequest(`dev/deployments/${id}`, {method: 'DELETE'}));
  if (result.success && result.data.active) {
    cacheUtil.invalidateDocs(result.data.project_id);
  }
  return result;
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

async function getProjectVersions(projectId: string, parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectVersions>> {
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
  removeProjectMember
};
