export enum ProjectStatus {
  UNKNOWN = 'unknown',
  LOADING = 'loading',
  HEALTHY = 'healthy',
  AT_RISK = 'at_risk',
  ERROR = 'error'
}

export enum DeploymentStatus {
  UNKNOWN = 'unknown',
  CREATED = 'created',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum ProjectIssueLevel {
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export type ProjectIssueType = 'deprecated_usage' | 'page_render' | 'invalid_content';
export type ProjectIssueStats = Record<ProjectIssueLevel, number>;

export interface ProjectIssue {
  id: string;
  level: ProjectIssueLevel;
  deployment_id: string | null;
  type: string;
  subject: string;
  details: string | null;
  file: string | null;
  version_name: string | null;
  created_at: string;
}