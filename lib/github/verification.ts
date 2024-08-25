import {Octokit} from "octokit";
import githubApp from "@/lib/github/githubApp";
import {Api} from "@octokit/plugin-rest-endpoint-methods";

export type UserRepositoryPermissions = Awaited<ReturnType<Api['rest']['repos']['getCollaboratorPermissionLevel']>>['data'];

async function verifyAppInstallationRepositoryOwnership(owner: string, repo: string, username: string): Promise<boolean> {
  try {
    const installationId = await githubApp.getExistingInstallation(owner, repo);
    const octokit = await githubApp.createInstance(installationId)
    const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({ owner, repo, username })).data;
    return hasSufficientAccess(data);
  } catch (e) {
    // No-op
  }
  return false;
}

async function verifyRepositoryOwnership(owner: string, repo: string, access_token: string): Promise<boolean> {
  const octokit = new Octokit({ auth: access_token });

  try {
    const user = (await octokit.rest.users.getAuthenticated()).data;
    const data = (await octokit.rest.repos.getCollaboratorPermissionLevel({ owner, repo, username: user.login })).data;
    return hasSufficientAccess(data);
  } catch (e) {
    // No-op
  }

  return false;
}

function hasSufficientAccess(data: UserRepositoryPermissions): boolean {
  return data.user?.permissions?.admin === true || data.user?.permissions?.maintain === true;
}

const verification = {
  verifyRepositoryOwnership,
  verifyAppInstallationRepositoryOwnership
};

export default verification;