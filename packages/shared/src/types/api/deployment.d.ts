import {PaginatedData} from "../service";
import {ProjectIssue, ProjectRevision} from "./project";

export enum DeploymentStatus {
  UNKNOWN = 'unknown',
  CREATED = 'created',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface DevProjectDeployment {
  id: string;
  commit_hash: string;
  commit_message: string;
  status: DeploymentStatus;
  user_id: string;
  created_at: string;
  current: boolean;
}

export type DevProjectDeployments = PaginatedData<DevProjectDeployment>;

export interface FullDevProjectDeployment {
  id: string;
  project_id: string;
  revision: ProjectRevision | null;
  status: DeploymentStatus;
  user_id: string | null;
  created_at: string;
  active: boolean;

  source_repo: string;
  source_branch: string;
  source_path: string;

  issues: ProjectIssue[];
}