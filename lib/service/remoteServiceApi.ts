import {DevProject, PaginatedData, Project} from "@/lib/service/index";
import cacheUtil from "@/lib/cacheUtil";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {GameProjectRecipe, ProjectType} from "@/lib/service/types";
import {cookies} from "next/headers";

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

interface SuccessResponse {
  message: string;
}

interface StatusResponse {
  status: number;
}

interface SimpleErrorResponse extends StatusResponse {
  error: string;
}

interface ErrorResponse extends SimpleErrorResponse {
  details?: string;

  install_url?: string;
  can_verify_mr?: boolean;
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

interface ProjectRegisterResponse extends SuccessResponse {
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

export interface DevProjectsResponse {
  profile: UserProfile;
  projects: DevProject[];
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

export interface ProjectContentPage {
  id: string;
  name: string;
  path: string | null;
}
export type ProjectContentPages = PaginatedData<ProjectContentPage>;

export interface ProjectContentTag {
  id: string;
  items: string[];
}
export type ProjectContentTags = PaginatedData<ProjectContentTag>;

export interface ProjectContentRecipe {
  id: string;
  type: string;
  data: GameProjectRecipe;
}
export type ProjectContentRecipes = PaginatedData<ProjectContentRecipe>;

export interface DevProjectVersion {
  name: string;
  branch: string;
}
export type DevProjectVersions = PaginatedData<DevProjectVersion>;

export function assertBackendUrl(): string {
  if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
    throw new Error('Environment variable NEXT_PUBLIC_BACKEND_SERVICE_URL not set');
  }
  return process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;
}

export async function wrapJsonServiceCall<T = any, U = T>(callback: () => Promise<Response>, processor?: (body: T) => U): Promise<U | SimpleErrorResponse> {
  try {
    const resp = await callback();
    if (resp.ok) {
      const body = await resp.json();
      if ('error' in body) {
        console.error(body.error);
        return {...body, status: resp.status, error: body.error};
      }
      return processor?.(body) || body;
    } else {
      let body: any = {};
      try {
        body = await resp.json();
      } catch (e) {
      }
      console.error(resp);
      return {...body, status: resp.status, error: body?.error || 'unknown'};
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAllProjectIDs(): Promise<string[] | SimpleErrorResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest('projects', {}, 'GET'));
}

async function getPopularProjects(): Promise<Project[] | SimpleErrorResponse> {
  return wrapJsonServiceCall(() => sendCachedRequest('projects/popular'));
}

async function getUserDevProjects(): Promise<DevProjectsResponse | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest('dev/projects', {}, 'GET'));
}

async function getDevProject(id: string): Promise<DevProject | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}`, {}, 'GET'));
}

async function getProjectDevLog(id: string): Promise<string | SimpleErrorResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/log`, {}, 'GET'), a => a.content);
}

async function getDevProjectContentPages(id: string, params: Record<string, string | null>): Promise<ProjectContentPages | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/content/pages`, params, 'GET'));
}

async function getDevProjectContentTags(id: string, params: Record<string, string | null>): Promise<ProjectContentTags | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/content/tags`, params, 'GET'));
}

async function getDevProjectContentTagItems(id: string, tag: string, params: Record<string, string | null>): Promise<ProjectContentPages | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/content/tags/${tag}`, params, 'GET'));
}

async function getDevProjectContentRecipes(id: string, params: Record<string, string | null>): Promise<ProjectContentRecipes | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/content/recipes`, params, 'GET'));
}

async function getDevProjectVersions(id: string, params: Record<string, string | null>): Promise<DevProjectVersions | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/versions`, params, 'GET'));
}

async function registerProject(data: ProjectRegisterRequest): Promise<ProjectRegisterResponse | ErrorResponse> {
  return wrapJsonServiceCall(() => sendApiRequest('dev/projects', data));
}

async function updateProject(data: ProjectUpdateRequest): Promise<ProjectUpdateResponse | ErrorResponse> {
  return wrapJsonServiceCall(() => sendApiRequest('dev/projects', data, {}, {method: 'PUT'}));
}

async function deleteProject(id: string): Promise<SuccessResponse | ErrorResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}`, {}, 'DELETE'));
}

async function revalidateProject(id: string, token: string | null = null): Promise<SuccessResponse | ErrorResponse> {
  const result = await wrapJsonServiceCall(() => sendSimpleRequest(`dev/projects/${id}/invalidate`, {token}));
  if (!('error' in result)) {
    cacheUtil.invalidateDocs(id);
  } else {
    console.error('Error invalidating docs for project', id);
  }
  return result;
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

async function getUserProfile(): Promise<UserProfile | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest('auth/user', {}, 'GET'));
}

async function deleteUserAcount(): Promise<SimpleErrorResponse | StatusResponse> {
  return wrapJsonServiceCall(() => sendSimpleRequest('auth/user', {}, 'DELETE'));
}

async function getProjectLinks(project: Project, sourceUrl?: string): Promise<FeaturedProject["links"]> {
  let entries: any = {};
  for (const [key, value] of Object.entries(project.platforms)) {
    entries[key] = await platforms.getProjectURL(key as ProjectPlatform, value);
  }
  return {
    ...entries,
    github: sourceUrl
  };
}

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const popular = await getPopularProjects();
    if ('error' in popular) {
      return [];
    }

    const platformsProjects = await Promise.all(popular.map(async proj => {
      const resolved = await platforms.getPlatformProject(proj);
      return {project: proj, resolved}
    }));

    return await Promise.all(platformsProjects.map(async ({project, resolved}) => ({
      id: project.id,
      title: resolved.name,
      summary: resolved.summary,
      icon: resolved.icon_url,
      type: resolved.type,
      links: await getProjectLinks(project, resolved.source_url)
    })));
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
  deleteUserAcount,
  getDevProjectContentPages,
  getDevProjectVersions,
  getDevProjectContentTags,
  getDevProjectContentTagItems,
  getDevProjectContentRecipes
}