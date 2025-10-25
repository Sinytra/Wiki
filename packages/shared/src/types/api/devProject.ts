import {PaginatedData, ResolvedGameRecipe} from '../service';

export interface ProjectContentPage {
  id: string;
  name: string;
  icon: string | null;
  path: string | null;
}

export type ProjectContentPages = PaginatedData<ProjectContentPage>;

export interface ProjectContentTag {
  id: string;
  items: string[];
}

export type ProjectContentTags = PaginatedData<ProjectContentTag>;

export interface ProjectContentRecipe {
  id: string;
  data: ResolvedGameRecipe;
}

export type ProjectContentRecipes = PaginatedData<ProjectContentRecipe>;

export interface ProjectVersion {
  name: string;
  branch: string;
}

export type ProjectVersions = PaginatedData<ProjectVersion>;