import {PlatformProjectAuthor, PlatformProject, ProjectPlatformProvider, ProjectPlatform} from "@/lib/platforms/universal";
import {modrinthModPlatform} from "@/lib/platforms/modrinth";
import {curseForgeModPlatform} from "@/lib/platforms/curseforge";

export * from '@/lib/platforms/universal';

const providers: { [key: string]: ProjectPlatformProvider } = {
  modrinth: modrinthModPlatform,
  curseforge: curseForgeModPlatform
}

function getProjectSourcePlatform(id: string): ProjectPlatformProvider {
  const source: ProjectPlatformProvider | undefined = providers[id];

  if (!source) {
    throw new Error(`Unknown project source ${id}`);
  }

  return source;
}

async function getPlatformProject(source: ProjectPlatform, slug: string): Promise<PlatformProject> {
  return getProjectSourcePlatform(source).getProject(slug);
}

async function getProjectAuthors(source: PlatformProject): Promise<PlatformProjectAuthor[]> {
  return getProjectSourcePlatform(source.platform).getProjectAuthors(source);
}

function getProjectURL(source: ProjectPlatform, slug: string): string {
  return getProjectSourcePlatform(source).getProjectURL(slug);
}

export default {
  getProjectAuthors,
  getPlatformProject,
  getProjectURL
};
