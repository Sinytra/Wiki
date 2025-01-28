import {Project} from "@/lib/service/index";
import cacheUtil from "@/lib/cacheUtil";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {ProjectType} from "@/lib/service/types";
import { cookies } from "next/headers";

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

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

interface SimpleErrorResponse extends StatusResponse {
  error: string;
}

interface RedirectResponse {
  url: string;
}

interface ProjectRegisterRequest {
  repo: string;
  branch: string;
  path: string;

  is_community?: boolean;
}

interface ProjectRegisterResponse extends SuccessResponse{
  project: Project;
}

interface ProjectUpdateRequest {
  repo: string;
  branch: string;
  path: string;
}

interface ProjectUpdateResponse extends SuccessResponse {
  project: Project;
}

export interface UserProfile {
  username: string;
  avatar_url: string;
  modrinth_id: string | null;
  created_at: string;
}

interface DevProjectsResponse {
  profile: UserProfile;
  projects: Project[];
}

export function assertBackendUrl(): string {
  if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_BACKEND_SERVICE_URL not set');
  }
  return process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;
}

async function registerProject(data: ProjectRegisterRequest): Promise<ProjectRegisterResponse | ErrorResponse> {
  try {
    const resp = await sendApiRequest('project/create', data);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateProject(data: ProjectUpdateRequest): Promise<ProjectUpdateResponse | ErrorResponse> {
  try {
    const resp = await sendApiRequest('project/update', data);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteProject(id: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/remove`);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function revalidateProject(id: string, token: string | null = null): Promise<SuccessResponse | ErrorResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/invalidate`, {token});
    if (resp.ok) {
      cacheUtil.invalidateDocs(id);
    } else {
      console.error('Error invalidating docs for project', id, resp);
    }
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getUserProfile(): Promise<UserProfile | StatusResponse> {
  try {
    const resp = await sendSimpleRequest('auth/user', {}, 'GET');
    if (resp.ok) {
      return await resp.json();
    }
    return {status: resp.status};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function linkModrinthAcount(): Promise<RedirectResponse | SimpleErrorResponse> {
  try {
    const resp = await sendSimpleRequest('auth/link/modrinth', {}, 'GET');
    if (resp.ok) {
      return {url: resp.url};
    }
    const body = await resp.text();
    return {status: resp.status, error: body};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function unlinkModrinthAcount(): Promise<SimpleErrorResponse | StatusResponse> {
  try {
    const resp = await sendSimpleRequest('auth/unlink/modrinth');
    if (resp.ok) {
      return {status: resp.status};
    }
    const body = await resp.json();
    return {status: resp.status, error: body.error};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteUserAcount(): Promise<SimpleErrorResponse | StatusResponse> {
  try {
    const resp = await sendSimpleRequest('auth/user', {}, 'DELETE');
    if (resp.ok) {
      return {status: resp.status};
    }
    const body = await resp.json();
    return {status: resp.status, error: body.error};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getUserDevProjects(): Promise<DevProjectsResponse | StatusResponse> {
  try {
    const resp = await sendSimpleRequest('projects/dev', {}, 'GET');
    if (resp.ok) {
      return await resp.json();
    }
    return {status: resp.status};
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getDevProject(id: string): Promise<Project | StatusResponse> {
  try {
    const resp = await sendSimpleRequest(`project/${id}`, {}, 'GET');
    if (resp.ok) {
      return await resp.json();
    }
    return { status: resp.status };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getProjectDevLog(id: string): Promise<string | undefined> {
  try {
    const resp = await sendSimpleRequest(`project/${id}/log`, {}, 'GET');
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
  const searchParams = urlParams(params);

  return fetch(`${assertBackendUrl()}/api/v1/${path}?${searchParams}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      'Content-Type': 'application/json',
      cookie: cookies().toString()
    },
    body: JSON.stringify(data),
    cache: 'no-store',
    ...options
  });
}

async function sendCachedRequest(path: string, params: Record<string, string | null> = {}, method: string = 'GET', expire?: number, tag?: string) {
  const searchParams = urlParams(params);

  return fetch(`${assertBackendUrl()}/api/v1/${path}?${searchParams.toString()}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      cookie: cookies().toString()
    },
    next: {
      revalidate: expire || ONE_WEEK, // Revalidate every week
      tags: tag ? [tag] : undefined
    }
  });
}

async function sendSimpleRequest(path: string, params: Record<string, string | null> = {}, method: string = 'POST') {
  const searchParams = urlParams(params);

  return fetch(`${assertBackendUrl()}/api/v1/${path}?${searchParams.toString()}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      cookie: cookies().toString()
    },
    cache: 'no-store',
  });
}

export default {
  registerProject,
  updateProject,
  deleteProject,
  revalidateProject,
  getAllProjectIDs,
  getUserDevProjects,
  getFeaturedProjects,
  getProjectDevLog,
  getDevProject,
  getUserProfile,
  linkModrinthAcount,
  unlinkModrinthAcount,
  deleteUserAcount
}