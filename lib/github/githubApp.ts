import {App, Octokit} from "octokit";
import {Api} from "@octokit/plugin-rest-endpoint-methods";
import github from "@/lib/github/github";
import {revalidateTag, unstable_cache} from "next/cache";
import cacheUtil from "@/lib/cacheUtil";
import verification from "@/lib/github/verification";

export interface RepoInstallationState {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export type RepositoryContent = Awaited<ReturnType<Api['rest']['repos']['getContent']>>['data'];

function cachedFetch(...args: any[]) {
  return fetch(args[0], {
    ...args[1],
    next: {
      revalidate: 6000,
      tags: [cacheUtil.githubAppRequestsCacheId]
    },
  });
}

async function isRepositoryPublic(repo: string): Promise<boolean> {
  try {
    const parts = repo.split('/');
    const installationId = await githubApp.getExistingInstallation(parts[0], parts[1]);
    const octokit = await githubApp.createInstance(installationId);

    const data = (await octokit.rest.repos.get({owner: parts[0], repo: parts[1]})).data;
    return !data.private && data.visibility === 'public';
  } catch (e) {
    // Private / not found
  }

  return false;
}

async function getFileModifiedDate(octokit: Octokit, owner: string, repo: string, branch: string, path: string): Promise<Date | null> {
  const commits = await octokit.rest.repos.listCommits({owner, repo, sha: branch, path, page: 1, per_page: 1});
  if (commits.data.length > 0 && commits.data[0].commit.committer?.date) {
    return new Date(commits.data[0].commit.committer.date);
  }

  return null;
}

async function getInstallation(owner: string, repo: string, branch: string, path: string) {
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

async function getRepoContents(octokit: Octokit, owner: string, repo: string, ref: string, path: string): Promise<RepositoryContent | null> {
  const normalPath = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
  try {
    const resp = await octokit.rest.repos.getContent({
      owner, repo, ref, path: normalPath, mediaType: normalPath.includes('.png') ? {format: 'base64'} : undefined,
      request: {fetch: cachedFetch}
    });
    return resp.data;
  } catch (e) {
    return null;
  }
}

async function getRepoBranches(octokit: Octokit, owner: string, repo: string) {
  try {
    const resp = await octokit.rest.repos.listBranches({owner, repo});
    return resp.data;
  } catch (e) {
    return [];
  }
}

async function getExistingInstallation(owner: string, repo: string): Promise<number> {
  const getCachedAppOctokitRepoInstance = unstable_cache(
    async (owner: string, repo: string) => {
      try {
        const response = await createAppInstance().octokit.rest.apps.getRepoInstallation({owner, repo});
        return response.data.id;
      } catch (e: any) {
        throw new Error(`Error getting app installation on repository ${owner}/${repo}`)
      }
    },
    ['app_repo_installation'],
    {
      tags: [cacheUtil.getGithubAppRepoInstallCacheId(owner)]
    }
  );
  return getCachedAppOctokitRepoInstance(owner, repo);
}

async function getAvailableRepositories(owner: string, token: string) {
  const installationsForUserCache = unstable_cache(
    async () => {
      const response = await github.getAccessibleInstallations(token);
      return response.data.installations.map(i => i.id);
    },
    ['app_user_installations', owner],
    {
      tags: [cacheUtil.getGithubAppUserInstallCacheId(owner)]
    }
  );
  const repositoriesForInstallationsCache = unstable_cache(
    async (installationIds: number[]) => {
      const repositories = await Promise.all(installationIds.map(async id => github.getAccessibleAppRepositories(token, id)));
      return repositories.flatMap(a => a).filter(r => verification.hasSufficientAccess(r.permissions));
    },
    ['app_user_accessible_repositories'],
    {
      tags: [cacheUtil.getGithubAppUserReposCacheId(owner)]
    }
  );

  try {
    const installationIds = await installationsForUserCache();
    return await repositoriesForInstallationsCache(installationIds);
  } catch (e) {
    revalidateTag(cacheUtil.getGithubAppUserInstallCacheId(owner));
    revalidateTag(cacheUtil.getGithubAppUserReposCacheId(owner));
    console.error(e);
    return [];
  }
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

const githubApp = {
  getInstallation,
  getRepoContents,
  getRepoBranches,
  createInstance,
  getAvailableRepositories,
  getExistingInstallation,
  isRepositoryPublic,
  getFileModifiedDate
};

export default githubApp;