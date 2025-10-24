export enum ProjectStatus {
  UNKNOWN = 'unknown',
  LOADING = 'loading',
  HEALTHY = 'healthy',
  AT_RISK = 'at_risk',
  ERROR = 'error'
}

export interface ProjectRevision {
  hash: string;
  fullHash: string;
  message: string;
  authorName: string;
  authorEmail: string;
  date: string;

  url?: string;
}

export enum ProjectIssueLevel {
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export type ProjectIssueType = 'meta' | 'file' | 'git_clone' | 'git_info' | 'page' | 'ingestor' | 'internal' | 'unknown';

export type ProjectError = 'requires_auth' | 'no_repository' | 'repo_too_large' | 'no_branch' | 'no_path'
  | 'invalid_meta' | 'page_render' | 'duplicate_page' | 'unknown_recipe_type' | 'invalid_ingredient'
  | 'invalid_file' | 'invalid_format' | 'invalid_resloc' | 'invalid_version_branch'
  | 'missing_platform_project' | 'no_page_title'
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
