import {App, Octokit} from "octokit";
import {Api} from "@octokit/plugin-rest-endpoint-methods";

export interface RepoInstallationState {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export type RepositoryContent = Awaited<ReturnType<Api['rest']['repos']['getContent']>>['data'];

async function getInstallation(owner: string, repo: string, branch: string, path: string) {
  const app = new App({
    appId: process.env.APP_AUTH_GITHUB_ID!,
    privateKey: process.env.APP_AUTH_GITHUB_PRIVATE_KEY!
  });

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
  try {
    const resp = await octokit.rest.repos.getContent({owner, repo, ref, path});
    return resp.data;
  } catch (e) {
    return null;
  }
}

async function getRepoBranches(octokit: Octokit, owner: string, repo: string) {
  try {
    const resp = await octokit.rest.repos.listBranches({ owner, repo });
    return resp.data;
  } catch(e) {
    return [];
  }
}

async function createInstance(installationId: number): Promise<Octokit> {
  const app = new App({
    appId: process.env.APP_AUTH_GITHUB_ID!,
    privateKey: process.env.APP_AUTH_GITHUB_PRIVATE_KEY!
  });
  return await app.getInstallationOctokit(installationId);
}

const githubApp = {
  getInstallation,
  getRepoContents,
  getRepoBranches,
  createInstance
};

export default githubApp;