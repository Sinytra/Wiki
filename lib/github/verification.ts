import {Octokit} from "octokit";
import githubApp from "@/lib/github/githubApp";
import {Api} from "@octokit/plugin-rest-endpoint-methods";

interface UserRepoPermissions {
  pull: boolean;
  triage?: boolean | undefined;
  push: boolean;
  maintain?: boolean | undefined;
  admin: boolean;
}

async function verifyAppInstallationRepositoryOwnership(owner: string, repo: string, username: string): Promise<boolean> {
  try {
    const installationId = await githubApp.getExistingInstallation(owner, repo);
    const octokit = await githubApp.createInstance(installationId)
    const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({owner, repo, username})).data;
    return hasSufficientAccess(data.user?.permissions);
  } catch (e) {
    // No-op
  }
  return false;
}

async function verifyRepositoryOwnership(owner: string, repo: string, access_token: string): Promise<boolean> {
  const octokit = new Octokit({auth: access_token});

  try {
    const user = (await octokit.rest.users.getAuthenticated()).data;
    const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({owner, repo, username: user.login})).data;
    return hasSufficientAccess(data.user?.permissions);
  } catch (e) {
    // No-op
  }

  return false;
}

function hasSufficientAccess(data: UserRepoPermissions | undefined): boolean {
  return data?.admin === true || data?.maintain === true;
}

const verification = {
  verifyRepositoryOwnership,
  verifyAppInstallationRepositoryOwnership,
  hasSufficientAccess
};

export default verification;