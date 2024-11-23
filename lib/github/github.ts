import {Octokit} from "octokit";
import cacheUtil from "@/lib/cacheUtil";

export interface GitHubUserProfile {
  name: string;
  bio?: string;
  avatar_url: string;
  login: string;
  email?: string;
}

function cachedFetch(...args: any[]) {
  return fetch(args[0], {
    ...args[1],
    next: {
      revalidate: 6000,
      tags: [cacheUtil.githubRequestsCacheId]
    }
  });
}

async function getUserProfile(token: string): Promise<GitHubUserProfile> {
  return makeApiRequest(token, 'GET /user');
}

async function isRepositoryPublic(repo: string): Promise<boolean> {
  try {
    const resp = await fetch(`https://github.com/${repo}`);
    return resp.ok;
  } catch (e) {
    // Private / not found
  }
  return false;
}

async function makeApiRequest<T>(token: string, path: string, ...options: any[]) {
  const resp = await makeApiRequestRaw(token, path, ...options);
  return resp.data as T;
}

async function makeApiRequestRaw(token: string, path: string, ...options: any[]) {
  const octokit = new Octokit({auth: token});
  const resp = await octokit.request(path, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    request: {
      fetch: cachedFetch
    },
    ...options
  });
  if (resp.status === 200) {
    return resp;
  }
  throw new Error('Error fetching github api');
}

export default {
  getUserProfile,
  isRepositoryPublic
};
