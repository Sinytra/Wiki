import {
  PlatformProject,
  PlatformProjectAuthor,
  ProjectPlatformProvider
} from "./platforms/universal";
import {modrinthModPlatform} from "./platforms/modrinth";
import {curseForgeModPlatform} from "./platforms/curseforge";
import {ProjectPlatform, ProjectPlatforms} from "@repo/shared/types/platform";
import {Project, ProjectType} from "@repo/shared/types/service";
import {ProjectNotFoundError} from "./platforms/exception";
import issuesApi from "@repo/shared/api/issuesApi";

export * from './platforms/universal';
export * from './platforms/exception';

interface IdentifiableProject {
  id: string;
  platforms: ProjectPlatforms;
  name?: string;
  local?: boolean;
}

const providers: { [key in ProjectPlatform]: ProjectPlatformProvider } = {
  modrinth: modrinthModPlatform,
  curseforge: curseForgeModPlatform
}

function getProjectSourcePlatform(id: ProjectPlatform): ProjectPlatformProvider {
  const source: ProjectPlatformProvider | undefined = providers[id];

  if (!source) {
    throw new Error(`Unknown project source ${id}`);
  }

  return source;
}

async function getPlatformProject(project: IdentifiableProject, fallback: boolean = true): Promise<PlatformProject> {
  for (const key in providers) {
    const platform = key as ProjectPlatform;
    if (project.platforms[platform]) {
      try {
        return await providers[platform].getProject(project.platforms[platform]!);
      } catch (err) {
        if (fallback && err instanceof ProjectNotFoundError) {
          await reportMissingProject(project, platform);
          return createFallback(project);
        }
        throw err;
      }
    }
  }
  throw new Error(`No provider found for project ${project.id} on platforms ${JSON.stringify(project.platforms)}`);
}

async function getProjectAuthors(source: PlatformProject, fallback: boolean = true): Promise<PlatformProjectAuthor[]> {
  try {
    return await getProjectSourcePlatform(source.platform).getProjectAuthors(source);
  } catch (err) {
    if (fallback && err instanceof ProjectNotFoundError) {
      return [];
    }
    throw err;
  }
}

function getProjectURL(source: ProjectPlatform, slug: string, type: ProjectType): string {
  return getProjectSourcePlatform(source).getProjectURL(slug, type);
}

async function reportMissingProject(project: IdentifiableProject, platform: ProjectPlatform) {
  await issuesApi.reportMissingPlatformProject(project as Project, platform);
}

function createFallback(project: IdentifiableProject): PlatformProject {
  return {
    slug: project.platforms.modrinth || project.platforms.curseforge || project.id,
    name: project.name || project.id,
    summary: '',
    description: '',
    icon_url: '',
    categories: [],
    game_versions: [],
    platform: project.platforms.modrinth ? 'modrinth' : 'curseforge',
    project_url: '',
    type: ProjectType.MOD,
    is_placeholder: false
  };
}

export default {
  getProjectAuthors,
  getProjectURL,
  getPlatformProject
};
