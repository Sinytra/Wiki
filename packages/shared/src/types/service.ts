import {DocumentationMarkdown} from '@repo/markdown';
import {AssetLocation} from '@repo/shared/assets';
import {
  BrowseResponse, ContentFileTreeEntry,
  FileTreeEntry, FullRecipeData, FullTagData, ItemContentPage, JsonValue, PaginatedData,
  ProjectData,
  ProjectType, ProjectVersionData, RecipeTypeResponse, ResolvedGameRecipe, ResolvedItem,
  ResourceLocation,
  TreeResponse, Frontmatter, ProjectPage, ResolvedLink
} from '@sinytra/wiki-api-types';

export type ProjectContentPages = PaginatedData<ItemContentPage>;

export type ProjectContentTags = PaginatedData<FullTagData>;

export type ProjectContentRecipes = PaginatedData<FullRecipeData>;

export type DevProjectVersions = PaginatedData<ProjectVersionData>;

export type FileTree = FileTreeEntry[];

export type ContentFileTree = ContentFileTreeEntry[];

export type ItemProperties =  { [key in string]: { [key in string]: JsonValue } };

export type PageLinks = { [key in string]: ResolvedLink };

export const AVAILABLE_PROJECT_TYPES: ProjectType[] = [
  'mod', 'modpack', 'datapack', 'resourcepack', 'plugin', 'shader'
];

export type ProjectVersions = string[];

export interface RenderedDocsPage {
  frontmatter: Frontmatter;
  content: DocumentationMarkdown;
  edit_url: string | null;
  properties: ItemProperties;
  links: PageLinks;
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

export interface ServiceProvider {
  getProject: (ctx: ProjectContext) => Promise<ProjectData | null>;
  getBackendLayout: (ctx: ProjectContext) => Promise<TreeResponse | null>;
  getAsset: (location: ResourceLocation, ctx: ProjectContext) => Promise<AssetLocation | null>;
  getDocsPage: (path: string[], optional: boolean, ctx: ProjectContext) => Promise<ProjectPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<BrowseResponse | null>;

  getProjectContents: (ctx: ProjectContext) => Promise<ContentFileTree | null>;
  getProjectContentPage: (id: string, ctx: ProjectContext) => Promise<ProjectPage | null>;
  getProjectRecipe: (recipe: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe | null>;
  getRecipeType: (type: string, ctx: ProjectContext) => Promise<RecipeTypeResponse | null>;
  getContentRecipeObtaining: (id: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe[] | null>
  getContentRecipeUsage: (id: string, ctx: ProjectContext) => Promise<ResolvedItem[] | null>;
}

export interface ServiceProviderFactory {
  isAvailable: () => boolean;
  create: () => ServiceProvider
}