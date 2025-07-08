import {DocumentationMarkdown} from "@repo/markdown";
import {AssetLocation} from "@repo/shared/assets";
import {ProjectPlatforms} from "./platform";
import {ResourceLocation} from "../resourceLocation";
import {ProjectIssueStats, ProjectRevision, ProjectStatus} from "./api/project";

export interface FileTreeEntry {
  name: string;
  path: string;
  icon?: string;
  type: 'dir' | 'file';
  children: FileTree;
}

export type FileTree = FileTreeEntry[];

export enum ProjectType {
  MOD = 'mod',
  MODPACK = 'modpack',
  RESOURCEPACK = 'resourcepack',
  DATAPACK = 'datapack',
  SHADER = 'shader',
  PLUGIN = 'plugin'
}

export const AVAILABLE_PROJECT_TYPES: string[] = [
  ProjectType.MOD, ProjectType.MODPACK, ProjectType.RESOURCEPACK, ProjectType.DATAPACK,
  ProjectType.SHADER, ProjectType.PLUGIN
];

export interface PaginatedData<T> {
  data: T[];
  total: number;
  pages: number;
  size: number;
}

export interface BaseProject {
  id: string;
  name: string;
  source_repo?: string;
  platforms: ProjectPlatforms;
  is_community: boolean;
  type: ProjectType;
}

export type ProjectVersions = string[];

export interface Project extends BaseProject {
  is_public: boolean;
  versions?: ProjectVersions;
  locales?: string[];
  local?: boolean;
  status?: ProjectStatus;
  has_active_deployment?: boolean;
  created_at: string;
}

export interface DevProject extends Project {
  source_repo: string;
  source_branch: string;
  source_path: string;
  revision: ProjectRevision;
  issue_stats?: ProjectIssueStats;
  has_failing_deployment: boolean;
}

export interface ProjectInfo {
  website?: string;
  pageCount: number;
  contentCount: number;
}

export interface ProjectWithInfo extends Project {
  info: ProjectInfo;
}

export interface LayoutTree {
  project: Project;
  tree: FileTree;
}

export type ItemProperties = Record<string, any>;

export interface DocumentationPage {
  project: Project;
  content: string;
  edit_url?: string;
  properties?: ItemProperties | null;
}

export interface RenderedDocsPage {
  project: Project;
  content: DocumentationMarkdown;
  edit_url?: string;
  properties?: ItemProperties | null;
}

export type ProjectSearchResults = PaginatedData<BaseProject>;

export interface ContentRecipeUsage {
  id: string;
  name?: string;
  project: string;
  has_page: boolean;
}

export type ProjectContentTree = ProjectContentEntry[];

export interface ProjectContentEntry extends FileTreeEntry {
  id?: string;
  children: ProjectContentTree;
}

export interface Slot {
  x: number;
  y: number;
}

export type SlotMap = Record<string, Slot>;

export interface GameRecipeType {
  id: string;
  localizedName: string | null;
  background: string;
  inputSlots: SlotMap;
  outputSlots: SlotMap;
}

export interface ResolvedItem {
  id: string;
  name: string | null;
  project: string;
  has_page: boolean;
}

export interface ResolvedSlot {
  input: boolean;
  slot: string;
  count: number;
  items: ResolvedItem[];
  tag: string | null;
}

export interface RecipeIngredientSummary {
  count: number;
  item: ResolvedItem;
  tag: string | null;
}

export interface RecipeSummary {
  inputs: RecipeIngredientSummary[];
  outputs: RecipeIngredientSummary[];
}

export interface ResolvedGameRecipeType {
  type: GameRecipeType;
  workbenches: ResolvedItem[];
}

export interface ResolvedGameRecipe {
  id: string;
  type: string;
  inputs: ResolvedSlot[];
  outputs: ResolvedSlot[];
  summary: RecipeSummary;
}

export interface DisplayItem extends ResolvedItem {
  asset: AssetLocation;
}

export interface ServiceProvider {
  getProject: (slug: string, version: string | null) => Promise<ProjectWithInfo | null>;
  getBackendLayout: (slug: string, version: string | null, locale: string | null) => Promise<LayoutTree | null>;
  getAsset: (slug: string, location: ResourceLocation, version: string | null) => Promise<AssetLocation | null>;
  getDocsPage: (slug: string, path: string[], version: string | null, locale: string | null, optional?: boolean) => Promise<DocumentationPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null>;

  getProjectContents: (project: string, version: string | null, locale: string | null) => Promise<ProjectContentTree | null>;
  getProjectContentPage: (project: string, id: string, version: string | null, locale: string | null) => Promise<DocumentationPage | null>;
  getProjectRecipe: (project: string, recipe: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipe | null>;
  getRecipeType: (project: string, type: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipeType | null>;
  getContentRecipeObtaining: (project: string, id: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipe[] | null>
  getContentRecipeUsage: (project: string, id: string, version: string | null, locale: string | null) => Promise<ContentRecipeUsage[] | null>;
}

export interface ServiceProviderFactory {
  isAvailable: () => boolean;
  create: () => ServiceProvider
}