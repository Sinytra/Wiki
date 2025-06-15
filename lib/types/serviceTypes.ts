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

export type ProjectIssueType = 'git_clone' | 'git_info' | 'page_render' | 'ingestor' | 'internal' | 'unknown';
export type ProjectError = 'requires_auth' | 'no_repository' | 'repo_too_large' | 'no_branch' | 'no_path'
  | 'invalid_meta' | 'invalid_page' | 'duplicate_page' | 'unknown_recipe_type' | 'invalid_ingredient'
  | 'invalid_file' | 'invalid_format'
  | 'unknown';
export type ProjectIssueStats = Record<ProjectIssueLevel, number>;

export interface ProjectIssue {
  id: string;
  level: ProjectIssueLevel;
  deployment_id: string | null;
  type: ProjectIssueType;
  subject: ProjectError;
  details: string | null;
  file: string | null;
  version_name: string | null;
  created_at: string;
}