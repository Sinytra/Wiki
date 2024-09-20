import {ModAuthor, ModPlatformProvider, ModProject} from "@/lib/platforms/universal";

const curseForgeApiBaseUrlV1: string = 'https://api.curseforge.com/v1';
const minecraftGameId = 432;
const minecraftModsCategoryId = 6;

interface CurseForgeProject {
  id: number;
  name: string;
  slug: string;
  summary: string;
  logo: {
    url: string;
  };
  categories: CurseForgeCategory[];
  authors: CurseForgeAuthor[];
  latestFilesIndexes: CurseForgeFile[];
  links: {
    sourceUrl: string;
  }
}

interface CurseForgeFile {
  gameVersion: string;
}

interface CurseForgeCategory {
  name: string;
  slug: string;
}

interface CurseForgeAuthor {
  id: number;
  name: string;
  url: string;
}

interface PaginatedResults<T> {
  data: T[];
  pagination: {
    index: number;
    pageSize: number;
    resultCount: number;
    totalCount: number;
  }
}

async function getProject(slug: string): Promise<ModProject> {
  const project = await getCurseForgeProject(slug);
  const description = await getProjectDescription(project.id);

  return {
    slug: project.slug,
    name: project.name,
    summary: project.summary,
    description,
    icon_url: project.logo.url,
    categories: project.categories.map(c => c.slug),
    game_versions: project.latestFilesIndexes.map(i => i.gameVersion).reverse(),
    license: undefined, // CF does not provide this information
    source_url: project.links.sourceUrl,

    platform: 'curseforge',
    project_url: getProjectURL(project.slug),
    extra: {
      authors: project.authors.map(a => ({ name: a.name, url: a.url } satisfies ModAuthor))
    }
  }
}

async function getProjectAuthors(mod: ModProject): Promise<ModAuthor[]> {
  return mod.extra.authors as ModAuthor[];
}

function getProjectURL(slug: string) {
  return `https://www.curseforge.com/minecraft/mc-mods/${slug}`;
}

async function getCurseForgeProject(slug: string): Promise<CurseForgeProject> {
  const results = await fetchCurseForgeApiInternal(`/mods/search?gameId=${minecraftGameId}&classId=${minecraftModsCategoryId}&slug=${slug}`) as PaginatedResults<CurseForgeProject>;
  if (results.pagination.resultCount === 1 && results.data.length === 1) {
    return results.data[0];
  }
  throw new Error(`Multiple projects found for slug '${slug}'`)
}

async function getProjectDescription(id: number): Promise<string> {
  const result = await fetchCurseForgeApiInternal(`/mods/${id}/description`) as any;
  return result.data;
}

async function fetchCurseForgeApiInternal<T>(path: string, headers?: any): Promise<T> {
  const response = await fetch(curseForgeApiBaseUrlV1 + path, {
    headers: {
      'x-api-key': process.env.CF_API_KEY,
      ...headers
    },
    next: {
      tags: ['curseforge'],
      revalidate: 3600
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CurseForge API: ${response.status}`);
  }
  const body = await response.json();
  return body as T;
}

export const curseForgeModPlatform: ModPlatformProvider = {
  getProject,
  getProjectAuthors,
  getProjectURL
}