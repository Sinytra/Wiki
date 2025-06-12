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

export interface ProjectIssueBody {
  type: ProjectIssueType;
  message: string;
  file: string;
}

export interface ProjectIssue {
  id: string;
  level: ProjectIssueLevel;
  page_path: string | null;
  deployment_id: string | null;
  created_at: string;
  body: ProjectIssueBody;
}