import {serializeUrlParams} from "@repo/shared/util";
import {ProjectReportType} from "@repo/shared/types/api/moderation";

export function createReportLink(project: string, type: ProjectReportType, path: string | null) {
  const params = serializeUrlParams({ project, type, path });
  return `/report?${params}`;
}