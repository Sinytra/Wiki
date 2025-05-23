import {
  ContentRecipeUsage,
  DocumentationPage,
  LayoutTree,
  ProjectSearchResults,
  ProjectWithInfo, ServiceProvider, ServiceProviderFactory
} from "@/lib/service/index";
import {AssetLocation} from "@/lib/assets";
import {assertBackendUrl, wrapJsonServiceCall} from "@/lib/service/remoteServiceApi";
import {GameProjectRecipe, ProjectContentTree} from "@/lib/service/types";

type RequestOptions = Parameters<typeof fetch>[1];

async function fetchBackendService(project: string, path: string, params: Record<string, string | null> = {}, method?: string, disableCache?: boolean, options?: RequestOptions) {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] != null) {
      searchParams.set(key, params[key]);
    }
  }
  return fetch(`${assertBackendUrl()}/api/v1/${path}?${searchParams.toString()}`, {
    ...options,
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      ...(options?.headers || {})
    },
    ...(disableCache ? {cache: 'no-store'} : {
      next: {
        tags: [`backend:${project}`]
      }
    })
  });
}

async function wrapNullableServiceCall<T = any, U = T>(callback: () => Promise<Response>, processor?: (body: T) => U): Promise<U | null> {
  try {
    const resp = await wrapJsonServiceCall<T, U>(callback, processor);
    // @ts-ignore
    if ('error' in resp) {
      return null;
    }
    return resp;
  } catch (error) {
    return null;
  }
}

async function getProject(project: string, version: string | null): Promise<ProjectWithInfo | null> {
  return wrapNullableServiceCall<ProjectWithInfo>(() => fetchBackendService(project, `docs/${project}`, {version}));
}

async function getBackendLayout(project: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  return wrapNullableServiceCall<LayoutTree>(() => fetchBackendService(project, `docs/${project}/tree`, {version, locale}));
}

async function getAsset(project: string, location: string, version: string | null): Promise<AssetLocation | null> {
  return getAssetURL(project, location, version);
}

function getAssetURL(project: string, location: string, version: string | null): AssetLocation | null {
  const url = `${assertBackendUrl()}/api/v1/docs/${project}/asset/${location}` + (version ? `?version=${version}` : '');
  return {
    id: location,
    src: url
  };
}

async function getDocsPage(project: string, path: string[], version: string | null, locale: string | null, optional?: boolean): Promise<DocumentationPage | null | undefined> {
  return wrapNullableServiceCall(
    () => fetchBackendService(project, `docs/${project}/page/${path.join('/')}.mdx`, {
      version,
      locale,
      optional: optional ? 'true' : null
    }),
    json => ({
      project: json.project,
      content: json.content,
      edit_url: json.edit_url
    })
  );
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults | null> {
  return await wrapNullableServiceCall(() => fetchBackendService('', `browse`, {
    query,
    page: page.toString(),
    types,
    sort
  }, 'GET', true));
}

async function getProjectContents(project: string, version: string | null, locale: string | null): Promise<ProjectContentTree | null> {
  return wrapNullableServiceCall<ProjectContentTree>(() => fetchBackendService(project, `content/${project}`, {version, locale}));
}

async function getProjectContentPage(project: string, id: string, version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  return wrapNullableServiceCall<DocumentationPage>(() => fetchBackendService(project, `content/${project}/${id}`, {version, locale}));
}

async function getProjectRecipe(project: string, recipe: string, version: string | null, locale: string | null): Promise<GameProjectRecipe | null> {
  return wrapNullableServiceCall<GameProjectRecipe>(() => fetchBackendService(project, `content/${project}/recipe/${recipe}`, {version, locale}));
}

async function getContentRecipeUsage(project: string, id: string, version: string | null, locale: string | null): Promise<ContentRecipeUsage[] | null> {
  return wrapNullableServiceCall<ContentRecipeUsage[]>(() => fetchBackendService(project, `content/${project}/${id}/usage`, {version, locale}));
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
  getContentRecipeUsage
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