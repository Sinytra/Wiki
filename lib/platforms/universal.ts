export type ModPlatform = 'modrinth' | 'curseforge';

export interface ModPlatformProvider {
  getProject: (slug: string) => Promise<ModProject>;
  getProjectAuthors: (mod: ModProject) => Promise<ModAuthor[]>;
  getProjectURL: (slug: string) => string;
}

export interface ModProject {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon_url: string;
  categories: string[];
  // Game versions, ascending
  game_versions: string[];
  license?: ModProjectLicense;
  source_url?: string;

  platform: ModPlatform;
  project_url: string;
  extra?: any;
  // For local preview CF projects
  is_placeholder?: boolean;
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