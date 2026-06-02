import { MarkdownError } from '@repo/markdown';
import network from '@repo/shared/network';
import { ProjectData, ProjectIssueInfo, AddIssueRequestBody } from '@sinytra/wiki-api-types';
import { ProjectPlatform } from '@repo/shared/types/platform';
import platforms from '@repo/shared/platforms';
import { ApiCallResult, ApiRouteParameters } from '@repo/shared/commonNetwork';

async function reportPageRenderFailure(
  project: ProjectData,
  path: string,
  error: any,
  version: string | null,
  locale: string | null
) {
  if (project.local) return;

  const details = error instanceof MarkdownError ? error.details : error.toString();

  await addProjectIssue(
    project.id,
    {
      level: 'error',
      type: 'page',
      subject: 'page_render',
      path,
      details
    },
    { version, locale }
  );
}

async function reportMissingPlatformProject(project: ProjectData, platform: ProjectPlatform) {
  if (project.local) return;

  const projectLink = platforms.getProjectURL(platform, project.platforms[platform]!, project.type);

  await addProjectIssue(project.id, {
    level: 'error',
    type: 'meta',
    subject: 'missing_platform_project',
    details: `${platform}: ${project.platforms[platform]} (${projectLink})`,
    path: null
  });
}

async function addProjectIssue(
  id: string,
  body: AddIssueRequestBody,
  parameters?: ApiRouteParameters
): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${id}/issues`, { parameters, body }));
}

async function getProjectIssues(projectId: string): Promise<ApiCallResult<ProjectIssueInfo[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/issues`));
}

export default {
  reportPageRenderFailure,
  reportMissingPlatformProject,
  getProjectIssues
};
