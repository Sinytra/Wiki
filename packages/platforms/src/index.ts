import {
  PlatformProject,
  PlatformProjectAuthor,
  ProjectPlatformProvider
} from "./universal";
import {modrinthModPlatform} from "./modrinth";
import {curseForgeModPlatform} from "./curseforge";
import {ProjectPlatform, ProjectPlatforms} from "@repo/shared/types/platform";

export * from './universal';

interface IdentifiableProject {
  id: string;
  platforms: ProjectPlatforms;
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

async function getPlatformProject(project: IdentifiableProject): Promise<PlatformProject> {
  for (let key in providers) {
    if (project.platforms[key as ProjectPlatform]) {
      return providers[key as ProjectPlatform].getProject(project.platforms[key as ProjectPlatform]!);
    }
  }
  throw new Error(`No provider found for project ${project.id} on platforms ${JSON.stringify(project.platforms)}`);
}

async function getProjectAuthors(source: PlatformProject): Promise<PlatformProjectAuthor[]> {
  return getProjectSourcePlatform(source.platform).getProjectAuthors(source);
}

async function getProjectURL(source: ProjectPlatform, slug: string): Promise<string> {
  return getProjectSourcePlatform(source).getProjectURL(slug);
}

export default {
  getProjectAuthors,
  getProjectURL,
  getPlatformProject
};
