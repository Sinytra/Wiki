import {Mod} from '@prisma/client';

import {ModAuthor, ModProject, ModPlatformProvider, ModPlatform} from "./universal";
import {modrinthModPlatform} from "./modrinth";
import {curseForgeModPlatform} from "@/lib/platforms/curseforge";

export * from './universal';

const providers: { [key: string]: ModPlatformProvider } = {
  modrinth: modrinthModPlatform,
  curseforge: curseForgeModPlatform
}

function getModSourcePlatform(id: string): ModPlatformProvider {
  const source: ModPlatformProvider | undefined = providers[id];

  if (!source) {
    throw new Error(`Unknown mod source ${id}`);
  }

  return source;
}

async function getPlatformProject(source: ModPlatform, slug: string): Promise<ModProject> {
  return getModSourcePlatform(source).getProject(slug);
}

async function getProject(mod: Mod): Promise<ModProject> {
  return getPlatformProject(mod.platform as ModPlatform, mod.slug);
}

async function getProjectAuthors(mod: ModProject): Promise<ModAuthor[]> {
  return getModSourcePlatform(mod.platform).getProjectAuthors(mod);
}

function getProjectURL(source: ModPlatform, slug: string): string {
  return getModSourcePlatform(source).getProjectURL(slug);
}

const platforms = {
  getProject,
  getProjectAuthors,
  getPlatformProject,
  getProjectURL
};

export default platforms;