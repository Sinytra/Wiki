import {Mod} from '@prisma/client';

import {ModAuthor, ModProject, ModPlatformProvider, ModPlatform} from "./universal";
import {modrinthModPlatform} from "./modrinth";

export * from './universal';

const platforms: { [key: string]: ModPlatformProvider } = {
  modrinth: modrinthModPlatform
}

function getModSourcePlatform(id: string): ModPlatformProvider {
  const source: ModPlatformProvider | undefined = platforms[id];

  if (!source) {
    throw new Error(`Unknown mod source ${id}`);
  }

  return source;
}

async function getPlatformProject(source: ModPlatform, slug: string): Promise<ModProject> {
  return getModSourcePlatform(source).getProject(slug);
}

async function getProject(mod: Mod): Promise<ModProject> {
  return getPlatformProject(mod.platform as ModPlatform, mod.id);
}

async function getProjectAuthors(mod: ModProject): Promise<ModAuthor[]> {
  return getModSourcePlatform(mod.platform).getProjectAuthors(mod.slug);
}

export default {
  getProject,
  getProjectAuthors,
  getPlatformProject
}