const userAgent: string = 'Sinytra/modded-wiki/1.0.0';
const modrinthApiBaseUrl: string = 'https://api.modrinth.com/v2'

interface ModrinthProject {
  slug: string;
  title: string;
  description: string;
  body: string;
}

async function getProject(slug: string): Promise<ModrinthProject> {
  return fetchModrinthApi(`/project/${slug}`);
}

async function fetchModrinthApi<T>(path: string): Promise<T> {
  const response = await fetch(modrinthApiBaseUrl + path, {
    headers: {
      'User-Agent': userAgent
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
  getProject
}

export default modrinth;