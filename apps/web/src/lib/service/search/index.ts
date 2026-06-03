import { AssetLocation } from '@repo/shared/assets';
import { ProjectType } from '@sinytra/wiki-api-types';

export interface BaseSearchResult {
  id: string;
  title: string;
  project_id: string;
  project_name: string;
  project_type: ProjectType;
  icon?: string | null;
}

export interface ProjectSearchResult extends BaseSearchResult {
  entry_type: 'project';
  project_icon_url?: string | null;
}

export interface DocumentSearchResult extends BaseSearchResult {
  entry_type: 'documentation';
  page_ref: string;
}

export interface ContentSearchResult extends BaseSearchResult {
  entry_type: 'content';
  page_ref: string;
  item_ids: string[];
}

export type SearchResult = ProjectSearchResult | DocumentSearchResult | ContentSearchResult;

export type WikiSearchResult = SearchResult & {
  href: string;
  icon_asset: AssetLocation | null;
};

export interface WikiSearchResults {
  total: number;
  hits: WikiSearchResult[];
}
