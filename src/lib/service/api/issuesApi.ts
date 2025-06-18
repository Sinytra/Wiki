import {MarkdownError} from "@repo/markdown";
import {actualLocale, actualVersion} from "@/lib/service/serviceUtil";
import {Project} from "@repo/shared/types/service";
import {ProjectRouteParams} from "@repo/shared/types/routes";
import network, {ApiCallResult, ApiRouteParameters} from "@repo/shared/network";
import {ProjectIssue, ProjectIssueLevel} from "@repo/shared/types/api/project";

interface AddProjectIssueRequest {
  level: ProjectIssueLevel;
  path: string;
  details: string;
}

async function reportPageRenderFailure(project: Project, path: string, error: any, params: ProjectRouteParams) {
  if (project.local) return;

  const details = error instanceof MarkdownError ? error.details : error.toString();

  await addProjectPageIssue(project.id, {
    level: ProjectIssueLevel.ERROR,
    path,
    details
  }, {version: actualVersion(params.version), locale: actualLocale(params.locale)});
}

async function addProjectPageIssue(id: string, body: AddProjectIssueRequest, parameters: ApiRouteParameters): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`dev/projects/${id}/issues`, { parameters, body }));
}

async function getProjectIssues(projectId: string): Promise<ApiCallResult<ProjectIssue[]>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`dev/projects/${projectId}/issues`))
}

export default {
  reportPageRenderFailure,
  getProjectIssues
}