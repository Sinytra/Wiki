import {serviceProviderFactory as localServiceProviderFactory} from "@/lib/previewer/localService";
import remoteService, {serviceProviderFactory as remoteServiceProviderFactory} from "@/lib/service/remoteService";
import assets, {AssetLocation} from "../assets";
import {ProjectPlatform} from "@/lib/platforms/universal";
import markdown, {ComponentPatcher, DocumentationMarkdown} from "@/lib/markdown";
import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import {DEFAULT_DOCS_VERSION, DEFAULT_LOCALE} from "@/lib/constants";
import {GameProjectRecipe, ProjectContentTree, ProjectType} from "@/lib/service/types";
import available from "@/lib/locales/available";
import {Language} from "@/lib/types/available";
import {ProjectIssueStats, ProjectStatus} from "@/lib/types/serviceTypes";

export type ProjectPlatforms = { [key in ProjectPlatform]?: string };

export interface StatusResponse {
  status: number;
}

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

export interface ProjectRevision {
  hash: string;
  fullHash: string;
  message: string;
  authorName: string;
  authorEmail: string;
  date: string;

  url?: string;
}

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
  issue_stats: ProjectIssueStats;
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

export type ProjectSearchResults = PaginatedData<BaseProject>;

export interface ContentRecipeUsage {
  id: string;
  name?: string;
  project: string;
  has_page: boolean;
}

export interface ServiceProvider {
  getProject: (slug: string, version: string | null) => Promise<ProjectWithInfo | null>;
  getBackendLayout: (slug: string, version: string | null, locale: string | null) => Promise<LayoutTree | null>;
  getAsset: (slug: string, location: string, version: string | null) => Promise<AssetLocation | null>;
  getDocsPage: (slug: string, path: string[], version: string | null, locale: string | null, optional?: boolean) => Promise<DocumentationPage | undefined | null>;
  searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null>;

  getProjectContents: (project: string, version: string | null, locale: string | null) => Promise<ProjectContentTree | null>;
  getProjectContentPage: (project: string, id: string, version: string | null, locale: string | null) => Promise<DocumentationPage | null>;
  getProjectRecipe: (project: string, recipe: string, version: string | null, locale: string | null) => Promise<GameProjectRecipe | null>;
  getContentRecipeObtaining: (project: string, id: string, version: string | null, locale: string | null) => Promise<GameProjectRecipe[] | null>
  getContentRecipeUsage: (project: string, id: string, version: string | null, locale: string | null) => Promise<ContentRecipeUsage[] | null>;
}

export interface ServiceProviderFactory {
  isAvailable: () => boolean;
  create: () => ServiceProvider
}

type AsyncMethodKey<T> = { [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never; }[keyof T];

function createProxy<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider, ...args: Parameters<ServiceProvider[T]>) => ReturnType<ServiceProvider[T]>
): (...args: Parameters<ServiceProvider[T]>) => Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  return (...args) => proxyServiceCall((p) => callback(p, ...args));
}

async function proxyServiceCall<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider) => ReturnType<ServiceProvider[T]>
): Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  const providers: ServiceProvider[] = [localServiceProviderFactory, remoteServiceProviderFactory]
    .filter(f => f.isAvailable())
    .map(f => f.create());
  for (const provider of providers) {
    const promise = callback(provider) as ReturnType<ServiceProvider[T]>;
    const result = await promise;
    if (result) {
      return result;
    }
  }
  return null;
}

function actualVersion(version: string | null): string | null {
  return version == DEFAULT_DOCS_VERSION ? null : version;
}

function actualLocale(locale: string | null): string | null {
  return !locale || locale == DEFAULT_LOCALE ? null : getLocaleName(locale);
}

function getLocaleName(locale: string) {
  const loc: Language = available.getForUrlParam(locale);
  return loc.prefix ? loc.prefix : `${locale}_${locale}`;
}

const getProject: (slug: string, version: string | null) => Promise<ProjectWithInfo | null> = createProxy<'getProject'>(
  (p, slug, version) => p.getProject(slug, actualVersion(version))
);
const getBackendLayout: (slug: string, version: string, locale: string) => Promise<LayoutTree | null> = createProxy<'getBackendLayout'>(
  (p, slug, version, locale) => p.getBackendLayout(slug, actualVersion(version), actualLocale(locale))
);

async function getAsset(slug: string | null, location: string, version: string | null): Promise<AssetLocation | null> {
  // For builtin assets
  if (!slug || slug === DEFAULT_RSLOC_NAMESPACE || location.startsWith(`${DEFAULT_RSLOC_NAMESPACE}:`) || !location.includes(':')) {
    const compatibleLocation = location.includes('/') ? location : prefixItemPath(location);
    return assets.getAssetResource(compatibleLocation);
  }
  return proxyServiceCall<'getAsset'>(p => p.getAsset(slug, location, actualVersion(version)));
}

function getAssetURL(slug: string, location: string, version: string | null): AssetLocation | null {
  return remoteServiceProviderFactory.isAvailable() ? remoteService.getAssetURL(slug, location, actualVersion(version)) : null;
}

const getDocsPage: (slug: string, path: string[], version: string, locale: string, optional?: boolean) => Promise<DocumentationPage | null | undefined> = createProxy<'getDocsPage'>(
  (p, slug, path, version, locale, optional) => p.getDocsPage(slug, path, actualVersion(version), actualVersion(locale), optional || false)
)

async function renderDocsPage(slug: string, path: string[], version: string, locale: string, optional?: boolean, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  const raw = await getDocsPage(slug, path, version, locale, optional) || null;
  return renderMarkdown(raw, patcher);
}

const searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null> = createProxy<'searchProjects'>(
  (p, query, page, types, sort) => p.searchProjects(query, page, types, sort)
);
const getProjectContents: (project: string, version: string | null, locale: string | null) => Promise<ProjectContentTree | null> = createProxy<'getProjectContents'>(
  (p, project, version, locale) => p.getProjectContents(project, actualVersion(version), actualLocale(locale))
);
const getProjectContentPage: (slug: string, id: string, version: string, locale: string) => Promise<DocumentationPage | null> = createProxy<'getProjectContentPage'>(
  (p, slug, id, version, locale) => p.getProjectContentPage(slug, id, actualVersion(version), actualLocale(locale))
);
const getContentRecipeObtaining: (project: string, id: string, version: string | null, locale: string | null) => Promise<GameProjectRecipe[] | null> = createProxy<'getContentRecipeObtaining'>(
  (p, project, id, version, locale) => p.getContentRecipeObtaining(project, id, actualVersion(version), actualLocale(locale))
);
const getContentRecipeUsage: (project: string, id: string, version: string | null, locale: string | null) => Promise<ContentRecipeUsage[] | null> = createProxy<'getContentRecipeUsage'>(
  (p, project, id, version, locale) => p.getContentRecipeUsage(project, id, actualVersion(version), actualLocale(locale))
);
const getProjectRecipe: (project: string, recipe: string, version: string | null, locale: string | null) => Promise<GameProjectRecipe | null> = createProxy<'getProjectRecipe'>(
  (p, project, recipe, version, locale) => p.getProjectRecipe(project, recipe, actualVersion(version), actualLocale(locale))
);

async function renderProjectContentPage(project: string, id: string, version: string, locale: string): Promise<RenderedDocsPage | null> {
  const raw = await getProjectContentPage(project, id, version, locale);
  return renderMarkdown(raw);
}

async function renderMarkdown(raw: DocumentationPage | null, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  if (raw) {
    const content = await markdown.renderDocumentationMarkdown(raw.content, patcher);
    return {
      project: raw.project,
      content,
      edit_url: raw.edit_url
    };
  }
  return null;
}

function prefixItemPath(location: string) {
  const parsed = resourceLocation.parse(location);
  return !parsed ? location : resourceLocation.toString({namespace: parsed.namespace, path: 'item/' + parsed.path});
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
  getContentRecipeUsage,
  getAssetURL,
  getProjectContentPage,
  getContentRecipeObtaining
}