import {GameProjectRecipe, PaginatedData} from "../service";

export interface ProjectContentPage {
  id: string;
  name: string;
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
  type: string;
  data: GameProjectRecipe;
}

export type ProjectContentRecipes = PaginatedData<ProjectContentRecipe>;

export interface ProjectVersion {
  name: string;
  branch: string;
}

export type ProjectVersions = PaginatedData<ProjectVersion>;