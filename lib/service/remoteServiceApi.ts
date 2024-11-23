import {Mod} from "@/lib/service/index";
import cacheUtil from "@/lib/cacheUtil";

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

interface ProjectRegisterRequest {
  repo: string;
  branch: string;
  path: string;

  is_community?: boolean;
  mr_code?: string;
}

interface ProjectUpdateRequest {
  repo: string;
  branch: string;
  path: string;
}

interface ProjectUpdateResponse extends SuccessResponse {
  project: Mod;
}

interface DevProjectsResponse {
  repositories: string[];
  projects: Mod[];
}

async function registerProject(data: ProjectRegisterRequest, token: string): Promise<SuccessResponse | ErrorResponse> {
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
      cacheUtil.invalidateDocs(id);
    }
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function migrateRepository(repo: string, token: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const data = {repo};
    const resp = await sendApiRequest(`project/migrate`, data, {token});
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getUserDevProjects(token: string): Promise<DevProjectsResponse> {
  try {
    const resp = await sendSimpleRequest(`projects/dev`, {token}, 'GET');
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAllProjectIDs(): Promise<string[]> {
  try {
    const resp = await sendSimpleRequest(`projects`);
    if (resp.ok) {
      return await resp.json() as string[];
    }
  } catch (e) {
    console.error(e);
  }
  return [];
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
  if (!process.env.BACKEND_SERVICE_URL) {
    throw new Error('Environment variable BACKEND_SERVICE_URL not set');
  }

  const searchParams = urlParams(params);

  return fetch(`${process.env.BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
    ...options
  });
}

async function sendSimpleRequest(path: string, params: Record<string, string | null> = {}, method: string = 'POST') {
  if (!process.env.BACKEND_SERVICE_URL) {
    throw new Error('Environment variable BACKEND_SERVICE_URL not set');
  }

  const searchParams = urlParams(params);

  return fetch(`${process.env.BACKEND_SERVICE_URL}/api/v1/${path}?${searchParams.toString()}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
    },
    cache: 'no-store'
  });
}

export default {
  registerProject,
  updateProject,
  deleteProject,
  revalidateProject,
  getAllProjectIDs,
  migrateRepository,
  getUserDevProjects
}