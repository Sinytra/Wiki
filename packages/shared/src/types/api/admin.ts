import {PaginatedData} from '@repo/shared/types/service';

export interface DataImport {
  id: number;
  game_version: string;
  loader: string;
  loader_version: string;
  user_id: string;
  created_at: string;
}

export type DataImports = PaginatedData<DataImport>;

export interface SystemStats {
  projects: number;
  users: number;
}

export interface SystemInfo {
  version: string;
  version_hash: string;
  latest_data: DataImport;
  stats: SystemStats;
}

export interface DataMigration {
  id: string;
  title: string;
  desc: string;
}

export interface AccessKey {
  id: number;
  name: string;
  user_id: string;
  expired: boolean;
  expires_at: string | null;
  created_at: string;
}

export type AccessKeys = PaginatedData<AccessKey>;