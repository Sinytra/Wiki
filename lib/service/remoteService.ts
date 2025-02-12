import {
  DocumentationPage,
  LayoutTree,
  Project,
  ProjectSearchResults,
  ServiceProvider
} from "@/lib/service/index";
import {AssetLocation} from "@/lib/assets";
import {assertBackendUrl, wrapJsonServiceCall} from "@/lib/service/remoteServiceApi";
import {GameProjectRecipe, ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";

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

async function getProject(project: string): Promise<Project | null> {
  return wrapNullableServiceCall<Project>(() => fetchBackendService(project, `docs/${project}`));
}

async function getBackendLayout(project: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  return wrapNullableServiceCall<LayoutTree>(() => fetchBackendService(project, `docs/${project}/tree`, {version, locale}));
}

async function getAsset(project: string, location: string, version: string | null): Promise<AssetLocation | null> {
  const url = `${assertBackendUrl()}/api/v1/docs/${project}/asset/${location}` + (version ? `?version=${version}` : '');
  return {
    id: location,
    src: url
  };
}

async function getDocsPage(project: string, path: string[], version: string | null, locale: string | null, optional: boolean): Promise<DocumentationPage | null> {
  return wrapNullableServiceCall(
    () => fetchBackendService(project, `docs/${project}/page/${path.join('/')}.mdx`, {
      version,
      locale,
      optional: optional ? 'true' : null
    }),
    json => ({
      project: json.project,
      content: json.content,
      edit_url: json.edit_url,
      updated_at: json.updated_at ? new Date(json.updated_at) : undefined
    })
  );
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  return await wrapNullableServiceCall(() => fetchBackendService('', `browse`, {
    query,
    page: page.toString(),
    types,
    sort
  }, 'GET', true)) || {pages: 0, total: 0, data: []};
}

async function getProjectRecipe(project: string, recipe: string): Promise<GameProjectRecipe | null> {
  return wrapNullableServiceCall<GameProjectRecipe>(() => fetchBackendService(project, `content/${project}/recipe/${recipe}`));
}

async function getProjectContents(project: string): Promise<ProjectContentTree | null> {
  return wrapNullableServiceCall<ProjectContentTree>(() => fetchBackendService(project, `content/${project}`));
}

async function getProjectContentPage(project: string, id: string): Promise<DocumentationPage | null> {
  return wrapNullableServiceCall<DocumentationPage>(() => fetchBackendService(project, `content/${project}/${id}`));
}

export default {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects,
  getProjectRecipe,
  getProjectContents,
  getProjectContentPage
} satisfies ServiceProvider