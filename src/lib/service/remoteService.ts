import {AssetLocation} from "@repo/shared/assets";
import {constructPagePath} from "@/lib/service/serviceUtil";
import {
  ContentRecipeUsage,
  DocumentationPage,
  LayoutTree,
  ProjectContentTree,
  ProjectSearchResults,
  ProjectWithInfo, ResolvedGameRecipe,
  ServiceProvider,
  ServiceProviderFactory
} from "@repo/shared/types/service";
import resourceLocation, {ResourceLocation} from "@repo/shared/resourceLocation";
import browseApi from "@/lib/service/api/browseApi";
import network, {ApiRouteParameters} from "@repo/shared/network";

async function sendApiRequest(project: string, path: string, parameters?: ApiRouteParameters) {
  return network.sendSimpleRequest(path, {
    parameters,
    cache: {
      tags: [`backend:${project}`]
    }
  });
}

async function resolveNullableApiCall<T extends object = never>(callback: () => Promise<Response>): Promise<T | null> {
  const res = await network.resolveApiCall<T>(callback);
  return res.success && !('error' in res.data) ? res.data : null;
}

async function getProject(project: string, version: string | null): Promise<ProjectWithInfo | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `docs/${project}`, {version}));
}

async function getBackendLayout(project: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `docs/${project}/tree`, {version, locale}));
}

async function getAsset(project: string, location: ResourceLocation, version: string | null): Promise<AssetLocation | null> {
  return getAssetURL(project, resourceLocation.toString(location), version);
}

function getAssetURL(project: string, location: string, version: string | null): AssetLocation | null {
  const url = network.constructApiUrl(`docs/${project}/asset/${location}`, {version});
  return {
    id: location,
    src: url
  };
}

async function getDocsPage(project: string, path: string[], version: string | null, locale: string | null, optional?: boolean): Promise<DocumentationPage | null> {
  return await resolveNullableApiCall(() => sendApiRequest(project, `docs/${project}/page/${constructPagePath(path)}`, {
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

async function getProjectContents(project: string, version: string | null, locale: string | null): Promise<ProjectContentTree | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}`, { version, locale }));
}

async function getProjectContentPage(project: string, id: string, version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/${id}`, { version, locale }));
}

async function getProjectRecipe(project: string, recipe: string, version: string | null, locale: string | null): Promise<ResolvedGameRecipe | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/recipe/${recipe}`, { version, locale }));
}

async function getContentRecipeObtaining(project: string, id: string, version: string | null, locale: string | null): Promise<ResolvedGameRecipe[] | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/${id}/recipe`, { version, locale }));
}

async function getContentRecipeUsage(project: string, id: string, version: string | null, locale: string | null): Promise<ContentRecipeUsage[] | null> {
  return resolveNullableApiCall(() => sendApiRequest(project, `content/${project}/${id}/usage`, { version, locale }));
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
  getContentRecipeObtaining
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