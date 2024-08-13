const userAgent: string = 'Sinytra/modded-wiki/1.0.0';
const modrinthApiBaseUrl: string = 'https://api.modrinth.com/v2'

interface ModrinthProject {
  slug: string;
  title: string;
  description: string;
  body: string;
}

interface ModrinthUser {
  username: string;
  bio: string;
  avatar_url: string;
}

async function getProject(slug: string): Promise<ModrinthProject> {
  return fetchModrinthApi(`/project/${slug}`);
}

async function getUserProjects(username: string): Promise<ModrinthProject[]> {
  return fetchModrinthApi(`/user/${username}/projects`)
}

async function getUserProfile(authToken: string): Promise<ModrinthUser> {
  return fetchModrinthApi('/user', {
    Authorization: authToken
  });
}

async function fetchModrinthApi<T>(path: string, headers?: any): Promise<T> {
  const response = await fetch(modrinthApiBaseUrl + path, {
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

const modrinth = {
  getProject,
  getUserProjects,
  getUserProfile
}

export default modrinth;