export type ModPlatform = 'modrinth' | 'curseforge';

export interface ModPlatformProvider {
  getProject: (slug: string) => Promise<ModProject>;
  getProjectAuthors: (slug: string) => Promise<ModAuthor[]>;
}

export interface ModProject {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon_url: string;
  categories: string[];
  game_versions: string[];
  license: ModProjectLicense;

  source: ModPlatform;
}

export interface ModProjectLicense {
  id: string;
  name: string | null;
  url: string | null;
}

export interface ModAuthor {
  name: string;
  url: string;
}