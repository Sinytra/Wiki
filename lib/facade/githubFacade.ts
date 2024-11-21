import github from "@/lib/github/github";
import githubCache from "@/lib/github/githubCache";
import githubApp, {CollaboratorRepositoryPermissions, RepositoryContent} from "@/lib/github/githubApp";

async function getUserRepositoriesForApp(owner: string, token: string) {
  const installations = await githubCache.getUserAccessibleInstallations.get(owner, token);
  const repositories = await Promise.all(installations.map(async id => github.getAccessibleAppRepositories(token, id)));
  return repositories.flatMap(a => a).filter(r => hasSufficientAccess(r.permissions));
}

async function getRepositoryContents(repo: string, ref: string, path: string): Promise<RepositoryContent | null> {
  try {
    const parts = repo.split('/');
    const installationId = await githubCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);

    return githubCache.getRepositoryContents.get(installationId, parts[0], parts[1], ref, path);
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getRepository(owner: string, repo: string) {
  const installationId = await githubCache.getExistingAppRepoInstallation.get(owner, repo);
  return githubApp.getRepository(installationId, owner, repo);
}

async function getRepoBranches(owner: string, repo: string) {
  const installationId = await githubCache.getExistingAppRepoInstallation.get(owner, repo);
  return githubApp.getRepoBranches(installationId, owner, repo);
}

async function verifyAppInstallationRepositoryOwnership(owner: string, repo: string, username: string): Promise<boolean> {
  try {
    const installationId = await githubCache.getExistingAppRepoInstallation.get(owner, repo);
    const permissions =  await githubApp.getRepoUserPermissionLevel(installationId, owner, repo, username);

    return hasSufficientAccess(permissions);
  } catch (e) {
    // No-op
  }
  return false;
}

async function verifyUserRepositoryOwnership(owner: string, repo: string, access_token: string): Promise<boolean> {
  try {
    const permissions = await github.getUserRepositoryPermissions(owner, repo, access_token);
    return hasSufficientAccess(permissions);
  } catch (e) {
    // No-op
  }
  return false;
}

function hasSufficientAccess(data: CollaboratorRepositoryPermissions): boolean {
  return data?.admin === true || data?.maintain === true;
}

export default {
  getUserRepositoriesForApp,
  isRepositoryPublic: github.isRepositoryPublic,
  getInstallation: githubApp.getInstallation,
  getRepository,
  getRepoBranches,
  getRepositoryContents,
  verifyAppInstallationRepositoryOwnership,
  verifyUserRepositoryOwnership
}