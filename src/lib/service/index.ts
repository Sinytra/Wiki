import remoteService, {serviceProviderFactory as remoteServiceProviderFactory} from "@/lib/service/remoteService";
import {AssetLocation} from "@repo/shared/assets";
import {
  ContentRecipeUsage,
  DocumentationPage,
  LayoutTree,
  ProjectContentTree,
  ProjectSearchResults,
  ProjectWithInfo,
  RenderedDocsPage, ResolvedGameRecipe, ResolvedGameRecipeType,
  ServiceProvider,
  ServiceProviderFactory
} from "@repo/shared/types/service";
import markdown, {ComponentPatcher} from "@repo/markdown";
import resourceLocation, {DEFAULT_NAMESPACE} from "@repo/shared/resourceLocation";
import {localServiceProviderFactory} from "@repo/previewer";
import builtinAssets from "@/lib/builtin/builtinAssets";
import PrefabUsage from "@/components/docs/shared/prefab/PrefabUsage";
import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";
import ContentLink from "@/components/docs/shared/ContentLink";
import ProjectRecipe from "@/components/docs/shared/game/ProjectRecipe";
import PrefabObtaining from "@/components/docs/shared/prefab/PrefabObtaining";
import ModAsset from "@/components/docs/shared/ModAsset";
import Callout from "@/components/docs/shared/Callout";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import PageLink from "@/components/docs/PageLink";
import Asset from "@/components/docs/shared/Asset";
import RecipeUsage from "@/components/docs/shared/game/RecipeUsage";
import CodeHikeCode from "@repo/ui/blocks/markdown/CodeHikeCode";
import CodeTabs from "@repo/ui/blocks/markdown/CodeTabs";

type AsyncMethodKey<T> = { [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never; }[keyof T];

const installedProviders: ServiceProviderFactory[] = [localServiceProviderFactory, remoteServiceProviderFactory];

function createProxy<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider, ...args: Parameters<ServiceProvider[T]>) => ReturnType<ServiceProvider[T]>
): (...args: Parameters<ServiceProvider[T]>) => Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  return (...args) => proxyServiceCall((p) => callback(p, ...args));
}

async function proxyServiceCall<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider) => ReturnType<ServiceProvider[T]>
): Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  const providers: ServiceProvider[] = installedProviders
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

const getProject: (slug: string, version: string | null) => Promise<ProjectWithInfo | null> = createProxy<'getProject'>(
  (p, slug, version) => p.getProject(slug, version)
);
const getBackendLayout: (slug: string, version: string, locale: string) => Promise<LayoutTree | null> = createProxy<'getBackendLayout'>(
  (p, slug, version, locale) => p.getBackendLayout(slug, version, locale)
);

async function getAsset(slug: string | null, location: string, version: string | null): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) return null;

  // For builtin assets
  if (!slug || resource.namespace === DEFAULT_NAMESPACE) {
    const compatibleLocation = location.includes('/') ? location : prefixItemPath(location);
    const compatibleResource = resourceLocation.parse(compatibleLocation);
    if (!compatibleResource) return null;

    return builtinAssets.getAssetResource(compatibleResource);
  }

  return proxyServiceCall<'getAsset'>(p => p.getAsset(slug, resource, version));
}

function getAssetURL(slug: string, location: string, version: string | null): AssetLocation | null {
  return remoteServiceProviderFactory.isAvailable() ? remoteService.getAssetURL(slug, location, version) : null;
}

const getDocsPage: (slug: string, path: string[], version: string, locale: string, optional?: boolean) => Promise<DocumentationPage | null | undefined> = createProxy<'getDocsPage'>(
  (p, slug, path, version, locale, optional) => p.getDocsPage(slug, path, version, locale, optional || false)
)

async function renderDocsPage(slug: string, path: string[], version: string, locale: string, optional?: boolean, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  const raw = await getDocsPage(slug, path, version, locale, optional) || null;
  return renderMarkdown(raw, patcher);
}

const searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null> = createProxy<'searchProjects'>(
  (p, query, page, types, sort) => p.searchProjects(query, page, types, sort)
);
const getProjectContents: (project: string, version: string | null, locale: string | null) => Promise<ProjectContentTree | null> = createProxy<'getProjectContents'>(
  (p, project, version, locale) => p.getProjectContents(project, version, locale)
);
const getProjectContentPage: (slug: string, id: string, version: string, locale: string) => Promise<DocumentationPage | null> = createProxy<'getProjectContentPage'>(
  (p, slug, id, version, locale) => p.getProjectContentPage(slug, id, version, locale)
);
const getContentRecipeObtaining: (project: string, id: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipe[] | null> = createProxy<'getContentRecipeObtaining'>(
  (p, project, id, version, locale) => p.getContentRecipeObtaining(project, id, version, locale)
);
const getContentRecipeUsage: (project: string, id: string, version: string | null, locale: string | null) => Promise<ContentRecipeUsage[] | null> = createProxy<'getContentRecipeUsage'>(
  (p, project, id, version, locale) => p.getContentRecipeUsage(project, id, version, locale)
);
const getProjectRecipe: (project: string, recipe: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipe | null> = createProxy<'getProjectRecipe'>(
  (p, project, recipe, version, locale) => p.getProjectRecipe(project, recipe, version, locale)
);
const getRecipeType: (project: string, type: string, version: string | null, locale: string | null) => Promise<ResolvedGameRecipeType | null> = createProxy<'getRecipeType'>(
  (p, project, type, version, locale) => p.getRecipeType(project, type, version, locale)
);

async function renderProjectContentPage(project: string, id: string, version: string, locale: string): Promise<RenderedDocsPage | null> {
  const raw = await getProjectContentPage(project, id, version, locale);
  return renderMarkdown(raw);
}

async function renderMarkdown(raw: DocumentationPage | null, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  if (raw) {
    const components = {
      CraftingRecipe, Callout, CodeHikeCode, ModAsset, Asset, CodeTabs, ProjectRecipe, ContentLink, RecipeUsage,
      PrefabObtaining, PrefabUsage,
      h2: LinkAwareHeading,
      a: PageLink
    }

    const content = await markdown.renderDocumentationMarkdown(raw.content, components, patcher);
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
  getContentRecipeObtaining,
  getRecipeType
}