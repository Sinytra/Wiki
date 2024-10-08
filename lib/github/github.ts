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

async function getAccessibleInstallations(token: string) {
  const octokit = new Octokit({auth: token});
  return octokit.rest.apps.listInstallationsForAuthenticatedUser();
}

async function getAccessibleAppRepositories(token: string, installationId: number) {
  const instance = new Octokit({auth: token});
  return github.getPaginatedData(instance, `GET /user/installations/${installationId}/repositories`, true);
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

async function getPaginatedData(instance: Octokit, url: string, disableCache?: boolean) {
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  let pagesRemaining: boolean = true;
  let data: any[] = [];

  while (pagesRemaining) {
    const response = await instance.request(url, {
      per_page: 100,
      request: !disableCache ? {fetch: cachedFetch} : undefined
    });

    const parsedData = parseData(response.data)
    data = [...data, ...parsedData];

    const linkHeader = response.headers.link;

    pagesRemaining = linkHeader !== undefined && linkHeader.includes(`rel=\"next\"`);

    if (pagesRemaining) {
      url = linkHeader!.match(nextPattern)![0];
    }
  }

  return data;
}

function parseData(data: any) {
  // If the data is an array, return that
  if (Array.isArray(data)) {
    return data
  }

  // Some endpoints respond with 204 No Content instead of empty array
  //   when there is no data. In that case, return an empty array.
  if (!data) {
    return []
  }

  // Otherwise, the array of items that we want is in an object
  // Delete keys that don't include the array of items
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  // Pull out the array of items
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];

  return data;
}

const github = {
  getUserProfile,
  getPaginatedData,
  getAccessibleInstallations,
  getAccessibleAppRepositories
};

export default github;