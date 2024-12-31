import localService from "@/lib/service/localService";
import remoteService from "@/lib/service/remoteService";
import assets, {AssetLocation} from "../assets";
import {ProjectPlatform} from "@/lib/platforms/universal";
import markdown, {DocumentationMarkdown} from "@/lib/markdown";
import {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@/lib/constants";
import {ProjectType} from "@/lib/service/types";
import available from "@/lib/locales/available";
import {Language} from "@/lib/types/available";

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

export interface Project extends BaseProject {
  is_public: boolean;
  versions?: Record<string, string>;
  locales?: string[];
  local?: boolean;
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
  updated_at?: Date;
  edit_url?: string;
}

export interface RenderedDocsPage {
  project: Project;
  content: DocumentationMarkdown;
  updated_at?: Date;
  edit_url?: string;
}

export interface ProjectSearchResults {
  data: BaseProject[];
  pages: number;
  total: number;
}

export interface ServiceProvider {
  getProject: (slug: string) => Promise<Project | null>;
  getBackendLayout: (slug: string, version: string | null, locale: string | null) => Promise<LayoutTree | null>;
  getAsset: (slug: string, location: string, version: string | null) => Promise<AssetLocation | null>;
  getDocsPage: (slug: string, path: string[], version: string | null, locale: string | null, optional: boolean) => Promise<DocumentationPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults>;
}

function getLocaleName(locale: string) {
  const loc: Language = available.getForUrlParam(locale);
  return loc.prefix ? loc.prefix : `${locale}_${locale}`;
}

async function getProject(slug: string): Promise<Project | null> {
  if (process.env.LOCAL_DOCS_ROOTS) {
    const localProject = await localService.getProject(slug);
    if (localProject) {
      return localProject;
    }
  }

  return remoteService.getProject(slug);
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
    return assets.getAssetResource(location);
  }

  const actualVersion = version == DEFAULT_DOCS_VERSION ? null : version;

  if (process.env.LOCAL_DOCS_ROOTS) {
    const asset = await localService.getAsset(slug, location, actualVersion);
    if (asset) {
      return asset;
    }
  }

  return remoteService.getAsset(slug, location, actualVersion);
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
  if (raw) {
    const content = await markdown.renderDocumentationMarkdown(raw.content);
    return {
      project: raw.project,
      content,
      edit_url: raw.edit_url,
      updated_at: raw.updated_at
    };
  }
  return null;
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  return remoteService.searchProjects(query, page, types, sort);
}

export default {
  getProject,
  getBackendLayout,
  getAsset,
  getDocsPage,
  renderDocsPage,
  searchProjects
}