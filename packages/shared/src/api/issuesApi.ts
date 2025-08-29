import {MarkdownError} from '@repo/markdown';
import {Project} from '@repo/shared/types/service';
import network from '@repo/shared/network';
import {ProjectError, ProjectIssue, ProjectIssueLevel, ProjectIssueType} from '@repo/shared/types/api/project';
import {ProjectPlatform} from '@repo/shared/types/platform';
import platforms from '@repo/shared/platforms';
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';

interface AddProjectIssueRequest {
  level: ProjectIssueLevel;
  type: ProjectIssueType;
  subject: ProjectError;
  path?: string;
  details: string;
}

async function reportPageRenderFailure(project: Project, path: string, error: any, version: string | null, locale: string | null) {
  if (project.local) return;

  const details = error instanceof MarkdownError ? error.details : error.toString();

  await addProjectIssue(project.id, {
    level: ProjectIssueLevel.ERROR,
    type: 'page_render',
    subject: 'invalid_page',
    path,
    details
  }, {version, locale});
}

async function reportMissingPlatformProject(project: Project, platform: ProjectPlatform) {
  if (project.local) return;

  const projectLink = platforms.getProjectURL(platform, project.platforms[platform]!, project.type);

  await addProjectIssue(project.id, {
    level: ProjectIssueLevel.ERROR,
    type: 'meta',
    subject: 'missing_platform_project',
    details: `${platform}: ${project.platforms[platform]} (${projectLink})`
  });
}

async function addProjectIssue(id: string, body: AddProjectIssueRequest, parameters?: ApiRouteParameters): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${id}/issues`, {parameters, body}));
}

async function getProjectIssues(projectId: string): Promise<ApiCallResult<ProjectIssue[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/issues`));
}

export default {
  reportPageRenderFailure,
  reportMissingPlatformProject,
  getProjectIssues
};