import {PlatformProjectAuthor, ProjectPlatformProvider, PlatformProject} from "./universal";
import localPreview from "@/lib/docs/localPreview";
import {AVAILABLE_PROJECT_TYPES, ProjectType} from "@/lib/service/types";

const userAgent: string = 'Sinytra/modded-wiki/1.0.0' + (localPreview.isEnabled() ? '/local' : '');
const modrinthApiBaseUrlV3: string = 'https://api.modrinth.com/v3';

interface ModrinthProject {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon_url: string;
  categories: string[];
  game_versions: string[];
  license: ModrinthProjectLicense;
  organization?: string;
  project_types: string[];
  link_urls: Record<string, LinkUrl>;
}

interface LinkUrl {
  url: string;
}

interface ModrinthProjectLicense {
  id: string;
  name: string | null;
  url: string | null;
}

interface ModrinthMember {
  user: ModrinthUser;
}

interface ModrinthUser {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
}

interface ModrinthOrganization {
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  members: ModrinthMember[];
}

async function getProject(slug: string): Promise<PlatformProject> {
  const mrProject = await getModrinthProject(slug);
  const type = mrProject.project_types.length < 1 || !AVAILABLE_PROJECT_TYPES.includes(mrProject.project_types[0])
      ? ProjectType.MOD
      : mrProject.project_types[0] as ProjectType;

  return {
    slug: mrProject.slug,
    name: mrProject.name,
    summary: mrProject.summary,
    description: mrProject.description,
    icon_url: mrProject.icon_url,
    categories: mrProject.categories,
    game_versions: mrProject.game_versions,
    license: {
      id: mrProject.license.id,
      name: mrProject.license.name,
      url: mrProject.license.url
    },
    source_url: mrProject.link_urls?.source?.url,
    discord_url: mrProject.link_urls?.discord?.url,

    platform: 'modrinth',
    project_url: await getProjectURL(mrProject.slug),
    type
  }
}

async function getProjectAuthors(source: PlatformProject): Promise<PlatformProjectAuthor[]> {
  const project = await getModrinthProject(source.slug);

  if (project.organization) {
    const org = await getProjectOrganization(project.slug);
    return [{name: org.name, url: getOrganizationURL(org)}];
  }

  const members = await getProjectMembers(project.slug);
  return members.map(member => ({
    name: member.user.username,
    url: getUserURL(member.user)
  }));
}

async function getModrinthProject(slug: string): Promise<ModrinthProject> {
  return fetchModrinthApiExperimental<ModrinthProject>(`/project/${slug}`);
}

async function getProjectOrganization(slug: string): Promise<ModrinthOrganization> {
  return fetchModrinthApiExperimental(`/project/${slug}/organization`);
}

async function getProjectMembers(slug: string): Promise<ModrinthMember[]> {
  return fetchModrinthApiExperimental(`/project/${slug}/members`);
}

async function fetchModrinthApiExperimental<T>(path: string, headers?: any): Promise<T> {
  return fetchModrinthApiInternal(modrinthApiBaseUrlV3, path, headers);
}

async function fetchModrinthApiInternal<T>(basePath: string, path: string, headers?: any): Promise<T> {
  const response = await fetch(basePath + path, {
    headers: {
      'User-Agent': userAgent,
      ...headers
    },
    next: {
      tags: ['modrinth'],
      revalidate: 60 * 60 * 24 * 14
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Modrinth API: ${response.status}`);
  }
  const body = await response.json();
  return body as T;
}

function getOrganizationURL(org: ModrinthOrganization) {
  return `https://modrinth.com/organization/${org.slug}`;
}

function getUserURL(user: ModrinthUser) {
  return `https://modrinth.com/user/${user.username}`;
}

async function getProjectURL(slug: string) {
  return `https://modrinth.com/mod/${slug}`;
}

export const modrinthModPlatform: ProjectPlatformProvider = {
  getProject,
  getProjectAuthors,
  getProjectURL
}
