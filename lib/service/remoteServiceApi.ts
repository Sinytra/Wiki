import {Project} from "@/lib/service/index";
import cacheUtil from "@/lib/cacheUtil";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {ProjectType} from "@/lib/service/types";

export type RegistrationErrors = 'user_github_auth' | 'insufficient_wiki_perms' | 'unsupported' | 'missing_installation'
  | 'insufficient_repo_perms' | 'no_branch' | 'no_meta' | 'invalid_meta' | 'exists' | 'cf_unavailable' | 'no_project'
  | 'ownership' | 'internal';

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  error: RegistrationErrors;
  details?: string;

  install_url?: string;
  can_verify_mr?: boolean;
}

interface StatusResponse {
  status: number;
}

interface ProjectRegisterRequest {
  repo: string;
  branch: string;
  path: string;

  is_community?: boolean;
  mr_code?: string;
}

interface ProjectRegisterResponse extends SuccessResponse{
  project: Project;
}

interface ProjectUpdateRequest {
  repo: string;
  branch: string;
  path: string;

  mr_code?: string;
}

interface ProjectUpdateResponse extends SuccessResponse {
  project: Project;
}

export interface GitHubUserProfile {
  name?: string;
  bio?: string;
  avatar_url: string;
  login: string;
  email?: string;
}

interface DevProjectsResponse {
  profile: GitHubUserProfile;
  repositories: string[];
  projects: Project[];
}

async function registerProject(data: ProjectRegisterRequest, token: string): Promise<ProjectRegisterResponse | ErrorResponse> {
  try {
    const resp = await sendApiRequest('project/create', data, {token});
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateProject(data: ProjectUpdateRequest, token: string): Promise<ProjectUpdateResponse | ErrorResponse> {
  try {
    const resp = await sendApiRequest('project/update', data, {token});
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteProject(id: string, token: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/remove`, {token});
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function revalidateProject(id: string, token: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/invalidate`, {token});
    if (resp.ok) {
      console.log('Invalidating docs for project', id);
      cacheUtil.invalidateDocs(id);
    } else {
      console.error('Error invalidating docs for project', id);
      console.error(resp);
    }
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function migrateRepository(repo: string, token: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const resp = await sendApiRequest('project/migrate', {repo}, {token});
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getUserDevProjects(token: string): Promise<DevProjectsResponse | StatusResponse> {
  try {
    const resp = await sendSimpleRequest('projects/dev', {token}, 'GET');
    if (resp.ok) {
      return await resp.json();
    }
    return {status: resp.status};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getDevProject(token: string, id: string): Promise<Project | StatusResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}`, {token}, 'GET');
    if (resp.ok) {
      return await resp.json();
    }
    return { status: resp.status };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getProjectDevLog(token: string, id: string): Promise<string | undefined> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/log`, {token}, 'GET');
    if (resp.ok) {
      return (await resp.json()).content;
    }
    return undefined;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAllProjectIDs(): Promise<string[]> {
  try {
    const resp = await sendSimpleRequest('projects', {}, 'GET');
    if (resp.ok) {
      return await resp.json() as string[];
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

async function getPopularProjects(): Promise<Project[]> {
  try {
    const resp = await sendCachedRequest('projects/popular');
    if (resp.ok) {
      return await resp.json() as Project[];
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export interface FeaturedProject {
  id: string;
  title: string;
  summary: string;
  icon: string;
  type: ProjectType;
  links: {
    curseforge?: string;
    modrinth?: string;
    github?: string;
  }
}

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const popular = await getPopularProjects();
    const platformsProjects = await Promise.all(popular.map(async proj => {
      const resolved = await platforms.getPlatformProject(proj);
      return {project: proj, resolved}
    }));
    return platformsProjects.map(({project, resolved}) => ({
      id: project.id,
      title: resolved.name,
      summary: resolved.summary,
      icon: resolved.icon_url,
      type: resolved.type,
      links: {
        ...Object.entries(project.platforms).reduce((prev, cur) => ({
          ...prev,
          [cur[0]]: platforms.getProjectURL(cur[0] as ProjectPlatform, cur[1])
        }), {}),
        github: resolved.source_url
      }
    }));
  } catch (e) {
    console.error('Error getting featured projects', e);
    return [];
  }
}

function urlParams(params: Record<string, string | null>) {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] != null) {
      searchParams.set(key, params[key]);
    }
  }
  return searchParams.toString();
}

async function sendApiRequest(path: string, data: any, params: Record<string, string | null> = {}, options?: Parameters<typeof fetch>[1]) {
  if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_BACKEND_SERVICE_URL not set');
  }

  const searchParams = urlParams(params);

  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    cache: 'no-store',
    ...options
  });
}

async function sendSimpleRequest(path: string, params: Record<string, string | null> = {}, method: string = 'POST') {
  if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_BACKEND_SERVICE_URL not set');
  }

  const searchParams = urlParams(params);

  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams.toString()}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
    },
    cache: 'no-store'
  });
}

async function sendCachedRequest(path: string, params: Record<string, string | null> = {}, method: string = 'GET') {
  if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_BACKEND_SERVICE_URL not set');
  }

  const searchParams = urlParams(params);

  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams.toString()}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
    },
    next: {
      revalidate: 60 * 60 * 24 * 7 // Revalidate every week
    }
  });
}

export default {
  registerProject,
  updateProject,
  deleteProject,
  revalidateProject,
  getAllProjectIDs,
  migrateRepository,
  getUserDevProjects,
  getFeaturedProjects,
  getProjectDevLog,
  getDevProject
}