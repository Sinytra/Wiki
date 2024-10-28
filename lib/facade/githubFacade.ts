import github from "@/lib/base/github/github";
import githubCache from "@/lib/cache/githubCache";
import {DocumentationFile, RemoteDocumentationSource} from "@/lib/docs/sources";
import githubApp, {CollaboratorRepositoryPermissions, RepositoryContent} from "@/lib/base/github/githubApp";

async function getExistingAppRepoInstallation(owner: string, repo: string): Promise<number> {
  try {
    return githubCache.getExistingAppRepoInstallation.get(owner, repo);
  } catch (e: any) {
    throw new Error(`Error getting app installation on repository ${owner}/${repo}`)
  }
}

async function getUserRepositoriesForApp(owner: string, token: string) {
  try {
    const installations = await githubCache.getUserAccessibleInstallations.get(owner, token);
    const repositories = await Promise.all(installations.map(async id => github.getAccessibleAppRepositories(token, id)));
    return repositories.flatMap(a => a).filter(r => hasSufficientAccess(r.permissions));
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function isRepositoryPublic(repo: string) {
  const parts = repo.split('/');
  const installationId = await githubCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);

  return githubCache.isRepositoryPublic.get(installationId, parts[0], parts[1]);
}

async function getRepositoryFileContents(source: RemoteDocumentationSource, path: string): Promise<DocumentationFile> {
  const parts = source.repo.split('/');
  const installationId = await githubCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);
  const filePath = source.path + (path ? '/' + path : '');

  return githubCache.getRepositoryFileContents.get(installationId, parts[0], parts[1], source.branch, filePath);
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
  isRepositoryPublic,
  getRepositoryFileContents,
  getExistingAppRepoInstallation,
  getInstallation: githubApp.getInstallation,
  getRepository,
  getRepoBranches,
  getRepositoryContents,
  readGitHubDirectoryTree: githubApp.readGitHubDirectoryTree, // TODO Cache
  verifyAppInstallationRepositoryOwnership,
  verifyUserRepositoryOwnership
}