import {DocumentationPage, LayoutTree, Project, ProjectSearchResults, ServiceProvider} from "@/lib/service/index";
import {AssetLocation} from "@/lib/assets";

type RequestOptions = Parameters<typeof fetch>[1];

interface AssetResponse {
  data: string;
}

interface PageResponse {
  project: Project;
  content: string;
  edit_url?: string;
  updated_at?: string;
}

async function fetchBackendService(project: string, path: string, params: Record<string, string | null> = {}, method?: string, disableCache?: boolean, options?: RequestOptions) {
  if (!process.env.BACKEND_SERVICE_URL) {
    throw new Error('Environment variable BACKEND_SERVICE_URL not set');
  }
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] != null) {
      searchParams.set(key, params[key]);
    }
  }
  return fetch(`${process.env.BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams.toString()}`, {
    ...options,
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      ...(options?.headers || {})
    },
    ...(disableCache ? {cache: 'no-store'} : {
      next: {
        tags: params.mod ? [`backend:${project}`] : []
      }
    })
  });
}

async function getProject(project: string): Promise<Project | null> {
  try {
    const resp = await fetchBackendService(project, `project/${project}`);
    if (resp.ok) {
      const json = await resp.json();
      return json.mod;
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getBackendLayout(project: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  try {
    const resp = await fetchBackendService(project, `project/${project}/tree`, {version, locale});
    if (resp.ok) {
      const data = await resp.json();
      if ('error' in data) {
        console.error(data.error);
        return null;
      }
      return data;
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getAsset(project: string, location: string, version: string | null): Promise<AssetLocation | null> {
  try {
    const resp = await fetchBackendService(project, `project/${project}/asset/${location}`, {version});
    if (resp.ok) {
      const json = await resp.json() as AssetResponse;
      return {
        id: location,
        src: json.data
      }
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getDocsPage(project: string, path: string[], version: string | null, locale: string | null, optional: boolean): Promise<DocumentationPage | null> {
  try {
    const resp = await fetchBackendService(project, `project/${project}/page/${path.join('/')}.mdx`, {
      version,
      locale,
      optional: optional ? "true" : null
    });
    if (resp.ok) {
      const json = await resp.json() as PageResponse;
      if ('error' in json) {
        return null;
      }

      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      return {
        project: json.project,
        content,
        edit_url: json.edit_url,
        updated_at: json.updated_at ? new Date(json.updated_at) : undefined
      }
    } else {
      console.error('Error getting page', path);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function searchProjects(query: string, page: number, types: string | null, sort: string | null): Promise<ProjectSearchResults> {
  try {
    const resp = await fetchBackendService('', `browse`, {query, page: page.toString(), types, sort}, 'GET', true);
    if (resp.ok) {
      return await resp.json();
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return {pages: 0, total: 0, data: []};
}

export default {
  getBackendLayout,
  getAsset,
  getDocsPage,
  getProject,
  searchProjects
} satisfies ServiceProvider