import remoteService, {serviceProviderFactory as remoteServiceProviderFactory} from "@/lib/service/remoteService";
import {AssetLocation} from "@repo/shared/assets";
import {
  ContentRecipeUsage,
  DocumentationPage,
  LayoutTree,
  ProjectContentTree, ProjectContext,
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

const getProject: (ctx: ProjectContext) => Promise<ProjectWithInfo | null> =
  createProxy<'getProject'>((p, ctx) => p.getProject(ctx));
const getBackendLayout: (ctx: ProjectContext) => Promise<LayoutTree | null> =
  createProxy<'getBackendLayout'>((p, ctx) => p.getBackendLayout(ctx));

async function getAsset(location: string, ctx: ProjectContext | null): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) return null;

  // For builtin assets
  if (!ctx || resource.namespace === DEFAULT_NAMESPACE) {
    const compatibleLocation = location.includes('/') ? location : prefixItemPath(location);
    const compatibleResource = resourceLocation.parse(compatibleLocation);
    if (!compatibleResource) return null;

    return builtinAssets.getAssetResource(compatibleResource);
  }

  return proxyServiceCall<'getAsset'>(p => p.getAsset(resource, ctx));
}

function getAssetURL(location: string, ctx: ProjectContext): AssetLocation | null {
  return remoteServiceProviderFactory.isAvailable() ? remoteService.getAssetURL(location, ctx) : null;
}

const getDocsPage: (path: string[], optional: boolean, ctx: ProjectContext) => Promise<DocumentationPage | null | undefined> =
  createProxy<'getDocsPage'>((p, path, optional, ctx) => p.getDocsPage(path, optional || false, ctx));

async function renderDocsPage(path: string[], optional: boolean, ctx: ProjectContext, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  const raw = await getDocsPage(path, optional, ctx) || null;
  return renderMarkdown(raw, patcher);
}

const searchProjects: (query: string, page: number, types: string | null, sort: string | null) => Promise<ProjectSearchResults | null> = createProxy<'searchProjects'>(
  (p, query, page, types, sort) => p.searchProjects(query, page, types, sort)
);
const getProjectContents: (ctx: ProjectContext) => Promise<ProjectContentTree | null> =
  createProxy<'getProjectContents'>((p, ctx) => p.getProjectContents(ctx));
const getProjectContentPage: (id: string, ctx: ProjectContext) => Promise<DocumentationPage | null> =
  createProxy<'getProjectContentPage'>((p, id, ctx) => p.getProjectContentPage(id, ctx));
const getContentRecipeObtaining: (id: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe[] | null> =
  createProxy<'getContentRecipeObtaining'>((p, id, ctx) => p.getContentRecipeObtaining(id, ctx));
const getContentRecipeUsage: (id: string, ctx: ProjectContext) => Promise<ContentRecipeUsage[] | null> =
  createProxy<'getContentRecipeUsage'>((p, id, ctx) => p.getContentRecipeUsage(id, ctx));
const getProjectRecipe: (recipe: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe | null> =
  createProxy<'getProjectRecipe'>((p, recipe, ctx) => p.getProjectRecipe(recipe, ctx));
const getRecipeType: (type: string, ctx: ProjectContext) => Promise<ResolvedGameRecipeType | null> =
  createProxy<'getRecipeType'>((p, type, ctx) => p.getRecipeType(type, ctx));

async function renderProjectContentPage(id: string, ctx: ProjectContext): Promise<RenderedDocsPage | null> {
  const raw = await getProjectContentPage(id, ctx);
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
      edit_url: raw.edit_url,
      properties: raw.properties
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