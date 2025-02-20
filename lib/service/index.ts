import localService from "@/lib/service/localService";
import remoteService from "@/lib/service/remoteService";
import assets, {AssetLocation} from "../assets";
import {ProjectPlatform} from "@/lib/platforms/universal";
import markdown, {DocumentationMarkdown} from "@/lib/markdown";
import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@/lib/constants";
import {GameProjectRecipe, ProjectContentTree, ProjectType} from "@/lib/service/types";
import available from "@/lib/locales/available";
import {Language} from "@/lib/types/available";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import builtinRecipeTypes from "@/lib/builtin/builtinRecipeTypes";

export type ProjectPlatforms = { [key in ProjectPlatform]?: string };

export interface BaseProject {
  id: string;
  name: string;
  source_repo?: string;
  source_branch?: string;
  source_path?: string;
  platforms: ProjectPlatforms;
  is_community: boolean;
  type: ProjectType;
}

// TODO Split into DevProject
export interface Project extends BaseProject {
  is_public: boolean;
  versions?: Record<string, string>;
  locales?: string[];
  local?: boolean;
  status?: ProjectStatus;
  created_at: string;
}

export interface ProjectInfo {
  website?: string;
  pageCount: number;
  contentCount: number;
}

export interface ProjectWithInfo extends Project {
  info: ProjectInfo;
}

export interface FileTreeEntry {
  name: string;
  path: string;
  icon?: string;
  type: 'dir' | 'file';
  children: FileTree;
}

export type FileTree = FileTreeEntry[];

export interface LayoutTree {
  project: Project;
  tree: FileTree;
}

export interface DocumentationPage {
  project: Project;
  content: string;
  edit_url?: string;
}

export interface RenderedDocsPage {
  project: Project;
  content: DocumentationMarkdown;
  edit_url?: string;
}

export interface ProjectSearchResults {
  data: BaseProject[];
  pages: number;
  total: number;
}

export interface ContentRecipeUsage {
  id: string;
  name?: string;
  project: string;
  has_page: boolean;
}

export interface ServiceProvider {
  getProject: (slug: string, version: string | null) => Promise<Project | null>;
  getBackendLayout: (slug: string, version: string | null, locale: string | null) => Promise<LayoutTree | null>;
  getAsset: (slug: string, location: string, version: string | null) => Promise<AssetLocation | null>;
  getDocsPage: (slug: string, path: string[], version: string | null, locale: string | null, optional: boolean) => Promise<DocumentationPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults>;
  getProjectContents: (project: string) => Promise<ProjectContentTree | null>;
  getProjectRecipe: (project: string, recipe: string) => Promise<GameProjectRecipe | null>;
  getProjectContentPage: (project: string, id: string) => Promise<DocumentationPage | null>;
  getContentRecipeUsage: (project: string, id: string) => Promise<ContentRecipeUsage[] | null>;
}

function isRemoteAvailable() {
  return process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL != null;
}

function getLocaleName(locale: string) {
  const loc: Language = available.getForUrlParam(locale);
  return loc.prefix ? loc.prefix : `${locale}_${locale}`;
}

async function getProject(slug: string, version: string | null): Promise<ProjectWithInfo | null> {
  const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;

  // TODO Enable
  // if (process.env.LOCAL_DOCS_ROOTS) {
  //   const localProject = await localService.getProject(slug);
  //   if (localProject) {
  //     return localProject;
  //   }
  // }

  return remoteService.getProject(slug, actualVersion);
}

async function getBackendLayout(slug: string, version: string, locale: string): Promise<LayoutTree | null> {
  const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;
  const actualLocale = locale == DEFAULT_LOCALE ? null : getLocaleName(locale);

  if (process.env.LOCAL_DOCS_ROOTS) {
    const localLayout = await localService.getBackendLayout(slug, actualVersion, actualLocale);
    if (localLayout) {
      return localLayout;
    }
  }
  return remoteService.getBackendLayout(slug, actualVersion, actualLocale);
}

async function getAsset(slug: string | null, location: string, version: string | null): Promise<AssetLocation | null> {
  // For builtin assets
  if (!slug || slug === DEFAULT_RSLOC_NAMESPACE || location.startsWith(`${DEFAULT_RSLOC_NAMESPACE}:`) || !location.includes(':')) {
    const compatibleLocation = location.includes('/') ? location :  prefixItemPath(location);
    return assets.getAssetResource(compatibleLocation);
  }

  const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;

  if (process.env.LOCAL_DOCS_ROOTS) {
    const asset = await localService.getAsset(slug, location, actualVersion);
    if (asset) {
      return asset;
    }
  }

  return isRemoteAvailable() ? remoteService.getAsset(slug, location, actualVersion) : null;
}

async function getDocsPage(slug: string, path: string[], version: string, locale: string, optional?: boolean): Promise<DocumentationPage | null> {
  const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;
  const actualLocale = locale == DEFAULT_LOCALE ? null : getLocaleName(locale);

  if (process.env.LOCAL_DOCS_ROOTS) {
    const localPage = await localService.getDocsPage(slug, path, actualVersion, actualLocale, optional || false);
    if (localPage !== undefined) {
      return localPage;
    }
  }
  return remoteService.getDocsPage(slug, path, actualVersion, actualLocale, optional || false);
}

async function renderDocsPage(slug: string, path: string[], version: string, locale: string, optional?: boolean): Promise<RenderedDocsPage | null> {
  const raw = await getDocsPage(slug, path, version, locale, optional);
  return renderMarkdown(raw);
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  // TODO local
  return remoteService.searchProjects(query, page, types, sort);
}

async function getProjectContents(project: string): Promise<ProjectContentTree | null> {
  if (process.env.LOCAL_DOCS_ROOTS) {
    const localContents = await localService.getProjectContents(project);
    if (localContents) {
      return localContents;
    }
  }

  return isRemoteAvailable() ? remoteService.getProjectContents(project) : null;
}

async function getProjectContentPage(slug: string, id: string): Promise<DocumentationPage | null> {
  // const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;
  // const actualLocale = locale == DEFAULT_LOCALE ? null : getLocaleName(locale);

  if (process.env.LOCAL_DOCS_ROOTS) {
    const localPage = await localService.getProjectContentPage(slug, id);
    if (localPage !== undefined) {
      return localPage;
    }
  }
  return remoteService.getProjectContentPage(slug, id);
}

async function getContentRecipeUsage(project: string, id: string): Promise<ContentRecipeUsage[] | null> {
  return remoteService.getContentRecipeUsage(project, id);
}

async function renderProjectContentPage(project: string, id: string): Promise<RenderedDocsPage | null> {
  const raw = await getProjectContentPage(project, id);
  return renderMarkdown(raw);
}

async function renderMarkdown(raw: DocumentationPage | null): Promise<RenderedDocsPage | null> {
  if (raw) {
    const content = await markdown.renderDocumentationMarkdown(raw.content);
    return {
      project: raw.project,
      content,
      edit_url: raw.edit_url
    };
  }
  return null;
}

async function getProjectRecipe(project: string, recipe: string): Promise<GameProjectRecipe | null> {
  let result = await remoteService.getProjectRecipe(project, recipe);
  if (result && !result.type.localizedName) {
    const name = await builtinRecipeTypes.getRecipeTypeName(result.type.id);
    if (name) {
      return {...result, type: {...result.type, localizedName: name} };
    }
  }
  return result;
}

function prefixItemPath(location: string) {
  const parsed = resourceLocation.parse(location);
  return !parsed ? location : resourceLocation.toString({ namespace: parsed.namespace, path: 'item/' + parsed.path });
}

export default {
  getProject,
  getBackendLayout,
  getAsset,
  getDocsPage,
  renderDocsPage,
  searchProjects,
  getProjectContents,
  getProjectRecipe,
  renderProjectContentPage,
  getContentRecipeUsage
}