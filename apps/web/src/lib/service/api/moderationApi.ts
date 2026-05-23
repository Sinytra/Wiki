import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {z} from "zod";
import {projectReportSchema, ruleProjectReportSchema} from "@/lib/forms/schemas";
import {PaginatedData, ReportInfo} from "@sinytra/wiki-api-types";

async function submitProjectReport(body: z.infer<typeof projectReportSchema>): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendDataRequest(`moderation/report/${body.project_id}`, {body}));
}

async function getProjectReports(parameters: ApiRouteParameters): Promise<ApiCallResult<PaginatedData<ReportInfo>>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('moderation/reports', parameters));
}

async function getProjectReport(id: string): Promise<ApiCallResult<ReportInfo>> {
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
