import {Octokit} from "octokit";
import githubFacade from "@/lib/facade/githubFacade";
import {CollaboratorRepositoryPermissions} from "@/lib/base/github/githubApp";

async function verifyAppInstallationRepositoryOwnership(owner: string, repo: string, username: string): Promise<boolean> {
  try {
    const permissions = await githubFacade.getRepoUserPermissionLevel(owner, repo, username);
    return hasSufficientAccess(permissions);
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

function hasSufficientAccess(data: CollaboratorRepositoryPermissions): boolean {
  return data?.admin === true || data?.maintain === true;
}

const verification = {
  verifyRepositoryOwnership,
  verifyAppInstallationRepositoryOwnership,
  hasSufficientAccess
};

export default verification;