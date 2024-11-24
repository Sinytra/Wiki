import {DocumentationPage, LayoutTree, Mod, ModSearchResults, ServiceProvider} from "@/lib/service/index";
import {AssetLocation} from "@/lib/assets";

type RequestOptions = Parameters<typeof fetch>[1];

interface AssetResponse {
  data: string;
}

interface PageResponse {
  project: Mod;
  content: string;
  edit_url?: string;
  updated_at?: string;
}

async function fetchBackendService(mod: string, path: string, params: Record<string, string | null> = {}, method?: string, disableCache?: boolean, options?: RequestOptions) {
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
        tags: params.mod ? [`backend:${mod}`] : []
      }
    })
  });
}

async function getMod(mod: string): Promise<Mod | null> {
  try {
    const resp = await fetchBackendService(mod, `project/${mod}`);
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

async function getBackendLayout(mod: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  try {
    const resp = await fetchBackendService(mod, `project/${mod}/tree`, {version, locale});
    if (resp.ok) {
      return resp.json();
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getAsset(mod: string, location: string, version: string | null): Promise<AssetLocation | null> {
  try {
    const resp = await fetchBackendService(mod, `project/${mod}/asset/${location}`, {version});
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

async function getDocsPage(mod: string, path: string[], version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  try {
    const resp = await fetchBackendService(mod, `project/${mod}/page/${path.join('/')}.mdx`, {version, locale});
    if (resp.ok) {
      const json = await resp.json() as PageResponse;
      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      return {
        project: json.project,
        content,
        edit_url: json.edit_url,
        updated_at: json.updated_at ? new Date(json.updated_at) : undefined
      }
    } else {
      console.error(resp);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function searchMods(query: string, page: number): Promise<ModSearchResults> {
  try {
    const resp = await fetchBackendService('', `browse`, {query, page: page.toString()}, 'GET', true);
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
  getMod,
  searchMods
} satisfies ServiceProvider