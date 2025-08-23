import {PaginatedData} from '../service';
import {ProjectIssue, ProjectRevision} from './project';

export enum DeploymentStatus {
  UNKNOWN = 'unknown',
  CREATED = 'created',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface DevProjectDeploymentRow {
  id: string;
  commit_hash: string;
  commit_message: string;
  status: DeploymentStatus;
  user_id: string;
  created_at: string;
  active: boolean;
}

export type DevProjectDeployments = PaginatedData<DevProjectDeploymentRow>;

export interface PartialDevProjectDeployment {
  id: string;
  project_id: string;
  status: DeploymentStatus;
  user_id: string | null;
  created_at: string;
  active: boolean;

  source_repo: string;
  source_branch: string;
  source_path: string;
}

export interface FullDevProjectDeployment extends PartialDevProjectDeployment {
  revision: ProjectRevision | null;
  issues: ProjectIssue[];
}