import {AssetLocation} from "@repo/shared/assets";
import {constructPagePath} from "@/lib/service/serviceUtil";
import {
  ContentRecipeUsage,
  DocumentationPage,
  LayoutTree,
  ProjectContentTree, ProjectContext,
  ProjectSearchResults,
  ProjectWithInfo, ResolvedGameRecipe, ResolvedGameRecipeType,
  ServiceProvider,
  ServiceProviderFactory
} from "@repo/shared/types/service";
import resourceLocation, {ResourceLocation} from "@repo/shared/resourceLocation";
import browseApi from "@/lib/service/api/browseApi";
import network from "@repo/shared/network";
import commonNetwork, {ApiRouteParameters} from '@repo/shared/commonNetwork';

async function sendApiRequest(project: string, path: string, parameters?: ApiRouteParameters) {
  return network.sendSimpleRequest(path, {
    parameters,
    userAuth: false, // Don't include cookies
    cache: {
      tags: [`backend:${project}`]
    }
  });
}

async function resolveNullableApiCall<T extends object = never>(callback: () => Promise<Response>): Promise<T | null> {
  const res = await network.resolveApiCall<T>(callback);
  return res.success && !('error' in res.data) ? res.data : null;
}

async function getProject({id, version}: ProjectContext): Promise<ProjectWithInfo | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `docs/${id}`, {version}));
}

async function getBackendLayout({id, version, locale}: ProjectContext): Promise<LayoutTree | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `docs/${id}/tree`, {version, locale}));
}

async function getAsset(location: ResourceLocation, ctx: ProjectContext): Promise<AssetLocation | null> {
  return getAssetURL(resourceLocation.toString(location), ctx);
}

function getAssetURL(location: string, {id, version}: ProjectContext): AssetLocation | null {
  const url = commonNetwork.constructApiUrl(`docs/${id}/asset/${location}`, {version});
  return {
    id: location,
    src: url
  };
}

async function getDocsPage(path: string[], optional: boolean, {id, version, locale}: ProjectContext): Promise<DocumentationPage | null> {
  return await resolveNullableApiCall(() => sendApiRequest(id, `docs/${id}/page/${constructPagePath(path)}`, {
    version,
    locale,
    optional: optional ? 'true' : null
  }));
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults | null> {
  const results = await browseApi.searchProjects({
    query,
    page: page.toString(),
    types,
    sort
  });
  return results.success ? results.data : null;
}

async function getProjectContents({id, version, locale}: ProjectContext): Promise<ProjectContentTree | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `content/${id}`, { version, locale }));
}

async function getProjectContentPage(id: string, {id: project, version, locale}: ProjectContext): Promise<DocumentationPage | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/${id}`, { version, locale }));
}

async function getProjectRecipe(recipe: string, {id, version, locale}: ProjectContext): Promise<ResolvedGameRecipe | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `content/${id}/recipe/${recipe}`, { version, locale }));
}

async function getContentRecipeObtaining(id: string, {id: project, version, locale}: ProjectContext): Promise<ResolvedGameRecipe[] | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/${id}/recipe`, { version, locale }));
}

async function getContentRecipeUsage(id: string, {id: project, version, locale}: ProjectContext): Promise<ContentRecipeUsage[] | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `content/${project}/${id}/usage`, { version, locale }));
}

async function getRecipeType(type: string, {id, version, locale}: ProjectContext): Promise<ResolvedGameRecipeType | null> {
  return resolveNullableApiCall(() => sendApiRequest(id, `content/${id}/recipe-type/${type}`, { version, locale }));
}

const serviceProvider: ServiceProvider = {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects,
  getProjectRecipe,
  getProjectContents,
  getProjectContentPage,
  getContentRecipeUsage,
  getContentRecipeObtaining,
  getRecipeType
}

export const serviceProviderFactory: ServiceProviderFactory = {
  isAvailable() {
    return process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL != null;
  },
  create() {
    return serviceProvider;
  }
}

export default {
  getAssetURL
}