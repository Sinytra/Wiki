import {ModAuthor, ModProject, ModPlatformProvider} from "./universal";

const userAgent: string = 'Sinytra/modded-wiki/1.0.0';
const modrinthApiBaseUrl: string = 'https://api.modrinth.com/v2'
const modrinthApiBaseUrlV3: string = 'https://api.modrinth.com/v3'

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

interface SearchResponse {
  hits: ModrinthProject[];
}

async function getProject(slug: string): Promise<ModProject> {
  const mrProject = await getModrinthProject(slug);

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
    source_url: mrProject.link_urls?.source.url,

    platform: 'modrinth'
  }
}

async function getProjectAuthors(slug: string): Promise<ModAuthor[]> {
  const project = await getModrinthProject(slug);

  if (project.organization) {
    const org = await getProjectOrganization(project.slug);
    return [{name: org.name, url: modrinth.getOrganizationURL(org)}];
  }

  const members = await getProjectMembers(project.slug);
  return members.map(member => ({
    name: member.user.name,
    url: modrinth.getUserURL(member.user)
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

async function getUserProjects(username: string): Promise<ModrinthProject[]> {
  return fetchModrinthApiExperimental(`/user/${username}/projects`)
}

async function searchProjects(query: string): Promise<ModrinthProject[]> {
  const resp = await fetchModrinthApiExperimental(`/search?query=${query}`) as SearchResponse;
  return resp.hits;
}

async function getUserOrganizations(username: string): Promise<ModrinthOrganization[]> {
  return fetchModrinthApiExperimental(`/user/${username}/organizations`);
}

async function getOrganizationProjects(slug: string): Promise<ModrinthProject[]> {
  return fetchModrinthApiExperimental(`/organization/${slug}/projects`);
}

async function fetchModrinthApi<T>(path: string, headers?: any): Promise<T> {
  return fetchModrinthApiInternal(modrinthApiBaseUrl, path, headers);
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
      revalidate: 3600
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch Modrinth API');
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

async function isProjectMember(username: string, project: ModrinthProject): Promise<boolean> {
  if (project.organization) {
    const org = await getProjectOrganization(project.slug);
    if (org.members.some(m => m.user.username === username)) {
      return true;
    }
  } else {
    const members = await getProjectMembers(project.slug);
    if (members.some(m => m.user.username === username)) {
      return true;
    }
  }

  return false;
}

function isValidProject(project: ModrinthProject): boolean {
  return project.project_types.includes('mod');
}

export const modrinthModPlatform: ModPlatformProvider = {
  getProject,
  getProjectAuthors
}

const modrinth = {
  getProject,
  getUserOrganizations,
  getOrganizationProjects,
  searchProjects,
  getOrganizationURL,
  getUserURL,
  isProjectMember,
  isValidProject
}

export default modrinth;