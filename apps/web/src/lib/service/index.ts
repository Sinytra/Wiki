import { serviceProviderFactory as remoteServiceProviderFactory } from '@/lib/service/remoteService';
import { AssetLocation } from '@repo/shared/assets';
import {
  ContentFileTree,
  ProjectContentContext,
  ProjectContext,
  RenderedDocsPage,
  ServiceProvider,
  ServiceProviderFactory
} from '@repo/shared/types/service';
import markdown, { ComponentPatcher } from '@repo/markdown';
import resourceLocation from '@repo/shared/resourceLocation';
import { localServiceProviderFactory } from '@repo/previewer';
import PrefabUsage from '@/components/docs/shared/prefab/PrefabUsage';
import CraftingRecipe from '@/components/docs/shared/CraftingRecipe';
import ProjectRecipe from '@/components/docs/shared/game/ProjectRecipe';
import PrefabObtaining from '@/components/docs/shared/prefab/PrefabObtaining';
import ModAsset from '@/components/docs/shared/asset/ModAsset';
import Callout from '@/components/docs/shared/Callout';
import LinkAwareHeading from '@/components/docs/LinkAwareHeading';
import { BindableAsset } from '@/components/docs/shared/asset/Asset';
import { BindableRecipeUsage } from '@/components/docs/shared/game/RecipeUsage';
import CodeHikeCode from '@repo/ui/blocks/markdown/CodeHikeCode';
import CodeTabs from '@repo/ui/blocks/markdown/CodeTabs';
import DocsLink from '@/components/docs/shared/DocsLink';
import ExtendedImg from '@/components/docs/shared/ExtendedImg';
import VideoEmbed from '@/components/docs/shared/VideoEmbed';
import {
  BrowseResponse,
  ProjectData,
  ProjectPage,
  RecipeTypeResponse,
  ResolvedGameRecipe,
  ResolvedItem,
  TreeResponse
} from '@sinytra/wiki-api-types';
import ExtendedLink from '@/components/docs/shared/ExtendedLink';
import ContentLink from '@/components/docs/shared/ContentLink';
import { BindableAudio } from '@/components/docs/shared/asset/Audio';
import commonService from '@/lib/service/commonService';

type AsyncMethodKey<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];

const installedProviders: ServiceProviderFactory[] = [localServiceProviderFactory, remoteServiceProviderFactory];

function createProxy<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider, ...args: Parameters<ServiceProvider[T]>) => ReturnType<ServiceProvider[T]>
): (...args: Parameters<ServiceProvider[T]>) => Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  return (...args) => proxyServiceCall((p) => callback(p, ...args));
}

async function proxyServiceCall<T extends AsyncMethodKey<ServiceProvider>>(
  callback: (p: ServiceProvider) => ReturnType<ServiceProvider[T]>
): Promise<Awaited<ReturnType<ServiceProvider[T]>> | null> {
  const providers: ServiceProvider[] = installedProviders.filter((f) => f.isAvailable()).map((f) => f.create());
  for (const provider of providers) {
    const promise = callback(provider) as ReturnType<ServiceProvider[T]>;
    const result = await promise;
    if (result) {
      return result;
    }
  }
  return null;
}

const getProject: (ctx: ProjectContext) => Promise<ProjectData | null> = createProxy<'getProject'>((p, ctx) =>
  p.getProject(ctx)
);
const getBackendLayout: (ctx: ProjectContext) => Promise<TreeResponse | null> = createProxy<'getBackendLayout'>(
  (p, ctx) => p.getBackendLayout(ctx)
);

async function getAsset(location: string, ctx: ProjectContext | null): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) return null;

  // For builtin assets
  const builtin = commonService.getBuiltinAsset(location, resource, ctx);
  if (builtin != null) {
    return builtin;
  }

  if (ctx == null) {
    return null;
  }

  return proxyServiceCall<'getAsset'>((p) => p.getAsset(resource, ctx));
}

async function getItemAsset(location: string, ctx: ProjectContext | null): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) return null;

  // For builtin assets
  const builtin = commonService.getBuiltinAsset(location, resource, ctx);
  if (builtin != null) {
    return builtin;
  }

  if (ctx == null) {
    return null;
  }

  return proxyServiceCall<'getItemAsset'>((p) => p.getItemAsset(resource, ctx));
}

const getDocsPage: (path: string[], optional: boolean, ctx: ProjectContext) => Promise<ProjectPage | null | undefined> =
  createProxy<'getDocsPage'>((p, path, optional, ctx) => p.getDocsPage(path, optional || false, ctx));

const getDocsIndexPage: (ctx: ProjectContext) => Promise<ProjectPage | null | undefined> =
  createProxy<'getDocsIndexPage'>((p, ctx) => p.getDocsIndexPage(ctx));

async function renderDocsPage(
  path: string[],
  optional: boolean,
  ctx: ProjectContext,
  patcher?: ComponentPatcher
): Promise<RenderedDocsPage | null> {
  const raw = (await getDocsPage(path, optional, ctx)) || null;
  return renderMarkdown(raw, ctx, patcher);
}

async function renderDocsIndexPage(ctx: ProjectContext, patcher?: ComponentPatcher): Promise<RenderedDocsPage | null> {
  const raw = (await getDocsIndexPage(ctx)) || null;
  return renderMarkdown(raw, ctx, patcher);
}

const searchProjects: (
  query: string,
  page: number,
  types: string | null,
  sort: string | null
) => Promise<BrowseResponse | null> = createProxy<'searchProjects'>((p, query, page, types, sort) =>
  p.searchProjects(query, page, types, sort)
);
const getProjectContents: (ctx: ProjectContext) => Promise<ContentFileTree | null> = createProxy<'getProjectContents'>(
  (p, ctx) => p.getProjectContents(ctx)
);
const getProjectContentPage: (id: string, ctx: ProjectContext) => Promise<ProjectPage | null> =
  createProxy<'getProjectContentPage'>((p, id, ctx) => p.getProjectContentPage(id, ctx));
const getContentRecipeObtaining: (id: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe[] | null> =
  createProxy<'getContentRecipeObtaining'>((p, id, ctx) => p.getContentRecipeObtaining(id, ctx));
const getContentRecipeUsage: (id: string, ctx: ProjectContext) => Promise<ResolvedItem[] | null> =
  createProxy<'getContentRecipeUsage'>((p, id, ctx) => p.getContentRecipeUsage(id, ctx));
const getProjectRecipe: (recipe: string, ctx: ProjectContext) => Promise<ResolvedGameRecipe | null> =
  createProxy<'getProjectRecipe'>((p, recipe, ctx) => p.getProjectRecipe(recipe, ctx));
const getRecipeType: (type: string, ctx: ProjectContext) => Promise<RecipeTypeResponse | null> =
  createProxy<'getRecipeType'>((p, type, ctx) => p.getRecipeType(type, ctx));

async function renderProjectContentPage(
  id: string,
  ctx: ProjectContext | ProjectContentContext
): Promise<RenderedDocsPage | null> {
  const page = await getProjectContentPage(id, ctx);
  const patcher: ComponentPatcher = (c) => ({
    PrefabUsage: PrefabUsage.bind(null, ctx),
    PrefabObtaining: PrefabObtaining.bind(null, ctx),
    ...c
  });
  return renderMarkdown(page, ctx, patcher);
}

async function renderMarkdown(
  page: ProjectPage | null,
  ctx: ProjectContext | ProjectContentContext,
  patcher?: ComponentPatcher
): Promise<RenderedDocsPage | null> {
  if (page) {
    const components = {
      Asset: BindableAsset.bind(null, ctx),
      Audio: BindableAudio.bind(null, ctx),
      CraftingRecipe: CraftingRecipe.bind(null, ctx),
      ProjectRecipe: ProjectRecipe.bind(null, ctx),
      RecipeUsage: BindableRecipeUsage.bind(null, ctx),
      h2: LinkAwareHeading,
      a: ExtendedLink.bind(null, ctx, page.links),
      img: ExtendedImg.bind(null, ctx),
      Callout,
      CodeHikeCode,
      CodeTabs,
      VideoEmbed,
      // Deprecated TODO Remove
      ModAsset: ModAsset.bind(null, ctx),
      ContentLink: ContentLink.bind(null, ctx),
      DocsLink: DocsLink.bind(null, ctx)
    };

    const content = await markdown.renderDocumentationMarkdown(page.content, components, patcher);
    return {
      frontmatter: page.frontmatter,
      content,
      edit_url: page.edit_url,
      properties: page.properties,
      links: page.links
    };
  }
  return null;
}

export default {
  getProject,
  getBackendLayout,
  getAsset,
  getItemAsset,
  getDocsPage,
  renderDocsPage,
  renderDocsIndexPage,
  searchProjects,
  getProjectContents,
  getProjectRecipe,
  renderProjectContentPage,
  getContentRecipeUsage,
  getProjectContentPage,
  getContentRecipeObtaining,
  getRecipeType
};
