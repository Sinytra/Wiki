import {App, Octokit} from "octokit";
import {Api} from "@octokit/plugin-rest-endpoint-methods";
import github from "@/lib/github/github";
import cacheUtil from "@/lib/cacheUtil";
import {FileTreeNode, RemoteDocumentationSource} from "@/lib/docs/sources";
import githubFacade from "@/lib/facade/githubFacade";
import {components} from '@octokit/openapi-types';

export interface RepoInstallationState {
  owner: string;
  repo: string;
  branch: string | null;
  path: string | null;
}

export interface RepositoryFileContent {
  content: string;
  edit_url: string | null;
  updated_at: Date | null;
}

export type RepositoryContent = Awaited<ReturnType<Api['rest']['repos']['getContent']>>['data'];

export type CollaboratorRepositoryPermissions = components['schemas']['collaborator']['permissions'];

function cachedFetch(...args: any[]) {
  return fetch(args[0], {
    ...args[1],
    next: {
      revalidate: 6000,
      tags: [cacheUtil.githubAppRequestsCacheId]
    },
  });
}

async function isRepositoryPublic(installationId: number, owner: string, repo: string): Promise<boolean> {
  try {
    const octokit = await createInstance(installationId);

    const data = (await octokit.rest.repos.get({owner, repo})).data;
    return !data.private && data.visibility === 'public';
  } catch (e) {
    // Private / not found
  }
  return false;
}

async function getInstallation(owner: string, repo: string, branch: string | null, path: string | null) {
  const app = createAppInstance();
  const appOctokit: Octokit = app.octokit;

  try {
    const response = await appOctokit.rest.apps.getRepoInstallation({owner, repo});

    return {id: response.data.id};
  } catch (e: any) {

    if (e?.response?.status === 404) {
      const state = btoa(JSON.stringify({owner, repo, branch, path} satisfies RepoInstallationState));
      return {url: await app.getInstallationUrl({state})};
    }

    return null;
  }
}

async function getExistingAppRepoInstallation(owner: string, repo: string): Promise<number> {
  const response = await createAppInstance().octokit.rest.apps.getRepoInstallation({owner, repo});
  return response.data.id;
}

async function getUserAccessibleInstallations(token: string) {
  const response = await github.getAccessibleInstallations(token);
  return response.data.installations.map(i => i.id);
}

async function readGitHubDirectoryTree(source: RemoteDocumentationSource, path?: string, shallow?: boolean): Promise<FileTreeNode[]> {
  const repoParts = source.repo.split('/');
  const installationId = await githubFacade.getExistingAppRepoInstallation(repoParts[0], repoParts[1]);
  const octokit = await createInstance(installationId);

  const contentPath = path ? `${source.path}/${path}` : source.path;
  const content = await getRepositoryContentsInternal(octokit, repoParts[0], repoParts[1], source.branch, contentPath);
  if (content === null || !Array.isArray(content)) {
    return [];
  }

  const root = contentPath.startsWith('/') ? contentPath.substring(1) : contentPath;
  const recursiveResolver = shallow ? async () => [] : async (path: string) => {
    const c = await getRepositoryContentsInternal(octokit, repoParts[0], repoParts[1], source.branch, path);
    return Array.isArray(c) ? c : [];
  };
  return convertRepositoryContents(root, content, recursiveResolver);
}

async function convertRepositoryContents(root: string, files: any[], contentGetter: (path: string) => Promise<any[]>): Promise<FileTreeNode[]> {
  return Promise.all(files.filter(f => f.type === 'dir' || f.type === 'file').map(async f => ({
    name: f.name,
    path: f.path.substring(root.length),
    type: f.type === 'dir' ? 'directory' : 'file',
    children: await convertRepositoryContents(root, await contentGetter(f.path), contentGetter)
  })));
}

async function getRepositoryContents(installationId: number, owner: string, repo: string, ref: string, path: string): Promise<RepositoryContent> {
  const octokit = await createInstance(installationId);
  return getRepositoryContentsInternal(octokit, owner, repo, ref, path);
}

async function getRepositoryFileContents(installationId: number, owner: string, repo: string, branch: string, path: string): Promise<RepositoryFileContent> {
  const octokit = await createInstance(installationId);

  const file = await getRepositoryContentsInternal(octokit, owner, repo, branch, path);
  if (file && 'content' in file) {
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    const updated_at = await getFileModifiedDate(octokit, owner, repo, branch, path);
    return {content, edit_url: file.html_url, updated_at};
  }

  throw new Error(`Invalid file at path ${path}`);
}

async function getRepositoryContentsInternal(octokit: Octokit, owner: string, repo: string, ref: string, path: string): Promise<RepositoryContent> {
  const normalPath = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
  const resp = await octokit.rest.repos.getContent({
    owner, repo, ref, path: normalPath, mediaType: normalPath.includes('.png') ? {format: 'base64'} : undefined,
    request: {fetch: cachedFetch}
  });
  return resp.data;
}

async function getFileModifiedDate(octokit: Octokit, owner: string, repo: string, branch: string, path: string): Promise<Date | null> {
  const commits = await octokit.rest.repos.listCommits({owner, repo, sha: branch, path, page: 1, per_page: 1});
  if (commits.data.length > 0 && commits.data[0].commit.committer?.date) {
    return new Date(commits.data[0].commit.committer.date);
  }
  return null;
}

async function getRepository(installationId: number, owner: string, repo: string) {
  try {
    const octokit = await createInstance(installationId);
    const resp = await octokit.rest.repos.get({owner, repo});
    return resp.data;
  } catch (e) {
    return [];
  }
}

async function getRepoBranches(installationId: number, owner: string, repo: string) {
  try {
    const octokit = await createInstance(installationId);
    const resp = await octokit.rest.repos.listBranches({owner, repo});
    return resp.data;
  } catch (e) {
    return [];
  }
}

async function getRepoUserPermissionLevel(installationId: number, owner: string, repo: string, username: string): Promise<CollaboratorRepositoryPermissions> {
  const octokit = await createInstance(installationId)
  const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({owner, repo, username})).data;
  return data.user?.permissions || { pull: false, triage: false, push: false, maintain: false, admin: false };
}

async function createInstance(installationId: number): Promise<Octokit> {
  return await createAppInstance().getInstallationOctokit(installationId);
}

function createAppInstance(): App {
  return new App({
    appId: process.env.APP_AUTH_GITHUB_ID!,
    privateKey: process.env.APP_AUTH_GITHUB_PRIVATE_KEY!
  });
}

export default {
  getInstallation,
  getRepositoryContents,
  getRepoBranches,
  getExistingAppRepoInstallation,
  isRepositoryPublic,
  getRepository,
  getUserAccessibleInstallations,
  getRepositoryFileContents,
  readGitHubDirectoryTree,
  getRepoUserPermissionLevel
};
