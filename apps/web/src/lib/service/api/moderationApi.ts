import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {z} from "zod";
import {projectReportSchema, ruleProjectReportSchema} from "@/lib/forms/schemas";
import {ProjectReport, ProjectReports} from "@repo/shared/types/api/moderation";

async function submitProjectReport(body: z.infer<typeof projectReportSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest('moderation/reports', {body}));
}

async function getProjectReports(parameters: ApiRouteParameters): Promise<ApiCallResult<ProjectReports>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('moderation/reports', parameters));
}

async function getProjectReport(id: string): Promise<ApiCallResult<ProjectReport>> {
  return network.resolveApiCall(() => network.sendSimpleRequest(`moderation/reports/${id}`));
}

async function ruleProjectReport(id: string, body: z.infer<typeof ruleProjectReportSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`moderation/reports/${id}`, { body }));
}

export default {
  submitProjectReport,
  getProjectReports,
  getProjectReport,
  ruleProjectReport
}
