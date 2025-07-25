import {PlatformProject, PlatformProjectAuthor, ProjectPlatformProvider} from './universal';
import env from '@repo/shared/env';
import {ProjectType} from '@repo/shared/types/service';
import {ProjectNotFoundError} from './exception';

const curseForgeApiBaseUrlV1: string = 'https://api.curseforge.com/v1';
const minecraftGameId = 432;

const curseforgeProjectTypes: Record<number, ProjectType> = {
  6: ProjectType.MOD,
  12: ProjectType.RESOURCEPACK,
  6945: ProjectType.DATAPACK,
  6552: ProjectType.SHADER,
  4471: ProjectType.MODPACK,
  5: ProjectType.PLUGIN
};

const projectTypePaths: Record<ProjectType, string> = {
  [ProjectType.MOD]: 'mc-mods',
  [ProjectType.RESOURCEPACK]: 'texture-packs',
  [ProjectType.DATAPACK]: 'data-packs',
  [ProjectType.SHADER]: 'shaders',
  [ProjectType.MODPACK]: 'modpacks',
  [ProjectType.PLUGIN]: 'bukkit-plugins'
};

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
    websiteUrl: string;
    sourceUrl: string;
  }
  classId: number;
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

function shouldUsePlaceholder(): boolean {
  return !process.env.CF_API_KEY && env.isPreview();
}

async function getProject(slug: string): Promise<PlatformProject> {
  // CF API is not public, so we provide placeholder metadata in local previews
  if (shouldUsePlaceholder()) {
    return {
      slug,
      name: slug,
      summary: '',
      description: '',
      icon_url: '',
      categories: [],
      game_versions: [],
      license: undefined,
      source_url: '',

      platform: 'curseforge',
      project_url: getProjectURL(slug, ProjectType.MOD),
      extra: {
        authors: []
      },
      type: ProjectType.MOD,
      is_placeholder: true
    };
  }

  const project = await getCurseForgeProject(slug);
  const description = await getProjectDescription(project.id);
  const type = curseforgeProjectTypes[project.classId] || ProjectType.MOD;

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
    project_url: getProjectURL(project.slug, type),
    extra: {
      authors: project.authors.map(a => ({name: a.name, url: a.url} satisfies PlatformProjectAuthor))
    },
    type
  };
}

async function getProjectAuthors(source: PlatformProject): Promise<PlatformProjectAuthor[]> {
  return source.extra.authors as PlatformProjectAuthor[];
}

function getProjectURL(slug: string, type: ProjectType): string {
  const base = projectTypePaths[type];
  return `https://www.curseforge.com/${base}/${slug}`;
}

async function getCurseForgeProject(slug: string): Promise<CurseForgeProject> {
  if (isNumeric(slug)) {
    try {
      const results = await fetchCurseForgeApiInternal(`/mods/${slug}`) as { data: CurseForgeProject };
      return results.data;
    } catch (error) {
      console.error('Error fetching project by ID', slug, error);
    }
  }

  const results = await fetchCurseForgeApiInternal(`/mods/search?gameId=${minecraftGameId}&slug=${slug}`) as PaginatedResults<CurseForgeProject>;
  if (results.pagination.resultCount === 1 && results.data.length === 1) {
    return results.data[0]!;
  }

  if (results.pagination.resultCount === 0) {
    throw new ProjectNotFoundError(`No project found for slug ${slug}`);
  }

  throw new Error(`Multiple projects found for slug '${slug}'`);
}

async function getProjectDescription(id: number): Promise<string> {
  const result = await fetchCurseForgeApiInternal(`/mods/${id}/description`) as any;
  return result.data;
}

async function fetchCurseForgeApiInternal<T>(path: string, headers?: any): Promise<T> {
  if (!process.env.CF_API_KEY) {
    throw new Error('Missing CurseForge API (CF_API_KEY)');
  }

  const response = await fetch(curseForgeApiBaseUrlV1 + path, {
    headers: {
      'x-api-key': process.env.CF_API_KEY,
      ...headers
    },
    cache: 'force-cache',
    next: {
      tags: ['curseforge'],
      revalidate: 60 * 60 * 24 * 14
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CurseForge API: ${response.status}`);
  }
  const body = await response.json();
  return body as T;
}

function isNumeric(str: string) {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export const curseForgeModPlatform: ProjectPlatformProvider = {
  getProject,
  getProjectAuthors,
  getProjectURL
};