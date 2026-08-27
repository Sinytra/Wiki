import network from '@repo/shared/network';
import { ApiCallResult } from '@repo/shared/commonNetwork';
import { ProjectSummary, ProjectBrief } from '@sinytra/wiki-api-types';

async function getAllProjects(): Promise<ApiCallResult<ProjectBrief[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('projects', { userAuth: false }));
}

async function getProjectsByID(ids: string[]): Promise<ApiCallResult<ProjectSummary[]>> {
  const body = { ids };
  return network.resolveApiCall(() =>
    network.sendDataRequest('projects/bulk', {
      cache: true,
      userAuth: false,
      body
    })
  );
}

async function deleteProject(id: string): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${id}`, { method: 'DELETE' }));
}

export default {
  getAllProjects,
  getProjectsByID,
  deleteProject
};
