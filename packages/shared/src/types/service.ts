import {DocumentationMarkdown} from '@repo/markdown';
import {AssetLocation} from '@repo/shared/assets';
import {ProjectPlatforms} from './platform';
import {ResourceLocation} from '../resourceLocation';
import {ProjectIssueStats, ProjectRevision, ProjectStatus} from './api/project';

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

export type ProjectLicense = ({ id: string } | { name: string }) & { url?: string | null };

export interface ProjectLicenses {
  project: ProjectLicense
}

export interface ProjectInfo {
  website?: string;
  pageCount: number;
  contentCount: number;
  licenses?: ProjectLicenses
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

export interface ProjectContext {
  id: string;
  version?: string | null;
  locale?: string | null;
}

export interface ProjectContentContext extends ProjectContext {
  contentId: string;
}

export interface ContentItemName {
  source: string;
  id: string;
  name: string;
}

export interface ServiceProvider {
  getProject: (ctx: ProjectContext) => Promise<ProjectWithInfo | null>;
  getBackendLayout: (ctx: ProjectContext) => Promise<LayoutTree | null>;
  getAsset: (location: ResourceLocation, ctx: ProjectContext) => Promise<AssetLocation | null>;
  getDocsPage: (path: string[], optional: boolean, ctx: ProjectContext) => Promise<DocumentationPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null>;

  getProjectContents: (ctx: ProjectContext) => Promise<ProjectContentTree | null>;
  getProjectContentPage: (id: string, ctx: ProjectContext) => Promise<DocumentationPage | null>;
  getProjectRecipe: (recipe: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe | null>;
  getRecipeType: (type: string, ctx: ProjectContext) => Promise<ResolvedGameRecipeType | null>;
  getContentRecipeObtaining: (id: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe[] | null>
  getContentRecipeUsage: (id: string, ctx: ProjectContext) => Promise<ContentRecipeUsage[] | null>;
  getContentItemName: (id: string, ctx: ProjectContext) => Promise<ContentItemName | null>;
}

export interface ServiceProviderFactory {
  isAvailable: () => boolean;
  create: () => ServiceProvider
}