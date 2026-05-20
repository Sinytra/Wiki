import {PaginatedData} from '../service';
import {ProjectIssue, ProjectRevision} from './project';

export enum DeploymentStatus {
  UNKNOWN = 'unknown',
  CREATED = 'created',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

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

  revision: ProjectRevision | null;
}

export type DevProjectDeployments = PaginatedData<PartialDevProjectDeployment>;

export interface FullDevProjectDeployment extends PartialDevProjectDeployment {
  issues: ProjectIssue[];
}