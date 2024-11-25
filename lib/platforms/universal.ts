export type ProjectPlatform = 'modrinth' | 'curseforge';

export interface ProjectPlatformProvider {
  getProject: (slug: string) => Promise<PlatformProject>;
  getProjectAuthors: (mod: PlatformProject) => Promise<PlatformProjectAuthor[]>;
  getProjectURL: (slug: string) => string;
}

export interface PlatformProject {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon_url: string;
  categories: string[];
  // Game versions, ascending
  game_versions: string[];
  license?: PlatformProjectLicense;
  source_url?: string;

  platform: ProjectPlatform;
  project_url: string;
  extra?: any;
  // For local preview CF projects
  is_placeholder?: boolean;
}

export interface PlatformProjectLicense {
  id: string;
  name: string | null;
  url: string | null;
}

export interface PlatformProjectAuthor {
  name: string;
  url: string;
}