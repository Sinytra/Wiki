import {Project, StatusResponse} from "@/lib/service";
import {sendApiRequest} from "@/lib/service/remoteServiceApi";
import {ProjectIssueLevel} from "@/lib/types/serviceTypes";
import {MarkdownError} from "@/lib/util/exception";
import {actualLocale, actualVersion} from "@/lib/service/serviceUtil";

interface AddProjectIssueRequest {
  level: ProjectIssueLevel;
  path: string;
  details: string;
}

interface ProjectPathParams {
  slug: string;
  locale: string;
  version: string;
}

async function reportPageRenderFailure(project: Project, path: string, error: any, params: ProjectPathParams) {
  if (project.local) return;

  const details = error instanceof MarkdownError ? error.details : error.toString();

  await addProjectPageIssue(project.id, {
    level: ProjectIssueLevel.ERROR,
    path,
    details
  }, {version: actualVersion(params.version), locale: actualLocale(params.locale)});
}

async function addProjectPageIssue(id: string, request: AddProjectIssueRequest, params: Record<string, string | null>): Promise<StatusResponse> {
  return sendApiRequest(`dev/projects/${id}/issues`, request, params);
}

export default {
  reportPageRenderFailure
}