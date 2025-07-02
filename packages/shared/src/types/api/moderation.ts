import {PaginatedData} from "@repo/shared/types/service";

export type ProjectReportType = 'project' | 'docs' | 'content' | 'unknown';
export type ProjectReportReason = 'spam' | 'copyright' | 'content_rules' | 'tos' | 'unknown';
export type ProjectReportStatus = 'new' | 'dismissed' | 'accepted' | 'unknown';

export interface ProjectReport {
  id: string;
  type: ProjectReportType;
  reason: ProjectReportReason;
  body: string;
  status: ProjectReportStatus;
  submitter_id: string;
  project_id: string;
  path: string | null;
  locale: string | null;
  version: string | null;
  created_at: string;
}

export type ProjectReports = PaginatedData<ProjectReport>;