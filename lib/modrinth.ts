const userAgent: string = 'Sinytra/modded-wiki/1.0.0';
const modrinthApiBaseUrl: string = 'https://api.modrinth.com/v2'
const modrinthApiBaseUrlV3: string = 'https://api.modrinth.com/v3'

export interface ModrinthProject {
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
}

export interface ModrinthProjectLicense {
  id: string;
  name: string | null;
  url: string | null;
}

export interface ModrinthMember {
  user: ModrinthUser;
}

export interface ModrinthUser {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
}

export interface ModrinthOrganization {
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  members: ModrinthMember[];
}

interface SearchResponse {
  hits: ModrinthProject[];
}

async function getProject(slug: string): Promise<ModrinthProject> {
  return fetchModrinthApiExperimental(`/project/${slug}`);
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

async function getUserProfile(authToken: string): Promise<ModrinthUser> {
  return fetchModrinthApi('/user', {
    Authorization: authToken
  });
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
    const org = await modrinth.getProjectOrganization(project.slug);
    if (org.members.some(m => m.user.username === username)) {
      return true;
    }
  } else {
    const members = await modrinth.getProjectMembers(project.slug);
    if (members.some(m => m.user.username === username)) {
      return true;
    }
  }

  return false;
}

function isValidProject(project: ModrinthProject): boolean {
  return project.project_types.includes('mod');
}

const modrinth = {
  getProject,
  getProjectOrganization,
  getProjectMembers,
  getUserProjects,
  getUserProfile,
  getUserOrganizations,
  getOrganizationProjects,
  searchProjects,
  getOrganizationURL,
  getUserURL,
  isProjectMember,
  isValidProject
}

export default modrinth;