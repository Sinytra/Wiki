import {DocumentationPage, LayoutTree, Mod, ServiceProvider} from "@/lib/service/index";
import {AssetLocation} from "../assets";

interface AssetResponse {
  data: string;
}

interface PageResponse {
  mod: Mod;
  content: string;
  edit_url?: string;
  updated_at?: string;
}

async function fetchBackendService(path: string, params: Record<string, string | null>) {
  if (!process.env.BACKEND_SERVICE_URL) {
    throw new Error('Environment variable BACKEND_SERVICE_URL not set');
  }
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] != null) {
      searchParams.set(key, params[key]);
    }
  }
  return fetch(`${process.env.BACKEND_SERVICE_URL}/${path}?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`
    },
    next: {
      tags: [`backend:${params.mod || ''}`]
    }
  });
}

async function getBackendLayout(mod: string, version: string | null, locale: string | null): Promise<LayoutTree | null> {
  try {
    const resp = await fetchBackendService(`tree`, { mod, version, locale });
    if (resp.ok) {
      return resp.json();
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getAsset(mod: string, location: string, version: string | null): Promise<AssetLocation | null> {
  try {
    const resp = await fetchBackendService(`asset`, { mod, location, version });
    if (resp.ok) {
      const json = await resp.json() as AssetResponse;
      return {
        id: location,
        src: json.data
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function getDocsPage(mod: string, path: string[], version: string | null, locale: string | null): Promise<DocumentationPage | null> {
  try {
    const resp = await fetchBackendService(`page`, {mod, path: `${path.join('/')}.mdx`, version, locale});
    if (resp.ok) {
      const json = await resp.json() as PageResponse;
      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      return {
        mod: json.mod,
        content,
        edit_url: json.edit_url,
        updated_at: json.updated_at ? new Date(json.updated_at) : undefined
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export default {
  getBackendLayout,
  getAsset,
  getDocsPage
} satisfies ServiceProvider