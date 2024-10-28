import github from "@/lib/github/github";
import verification from "@/lib/github/verification";
import githubAppCache from "@/lib/cache/githubAppCache";
import {DocumentationFile, RemoteDocumentationSource} from "@/lib/docs/sources";
import githubApp, {CollaboratorRepositoryPermissions, RepositoryContent} from "@/lib/base/github/githubApp";

async function getExistingAppRepoInstallation(owner: string, repo: string): Promise<number> {
  try {
    return githubAppCache.getExistingAppRepoInstallation.get(owner, repo);
  } catch (e: any) {
    throw new Error(`Error getting app installation on repository ${owner}/${repo}`)
  }
}

async function getUserRepositoriesForApp(owner: string, token: string) {
  try {
    const installations = await githubAppCache.getUserAccessibleInstallations.get(owner, token);
    const repositories = await Promise.all(installations.map(async id => github.getAccessibleAppRepositories(token, id)));
    return repositories.flatMap(a => a).filter(r => verification.hasSufficientAccess(r.permissions));
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function isRepositoryPublic(repo: string) {
  const parts = repo.split('/');
  const installationId = await githubAppCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);

  return githubAppCache.isRepositoryPublic.get(installationId, parts[0], parts[1]);
}

async function getRepositoryFileContents(source: RemoteDocumentationSource, path: string): Promise<DocumentationFile> {
  const parts = source.repo.split('/');
  const installationId = await githubAppCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);
  const filePath = source.path + (path ? '/' + path : '');

  return githubAppCache.getRepositoryFileContents.get(installationId, parts[0], parts[1], source.branch, filePath);
}

async function getRepositoryContents(repo: string, ref: string, path: string): Promise<RepositoryContent | null> {
  try {
    const parts = repo.split('/');
    const installationId = await githubAppCache.getExistingAppRepoInstallation.get(parts[0], parts[1]);

    return githubAppCache.getRepositoryContents.get(installationId, parts[0], parts[1], ref, path);
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getRepoUserPermissionLevel(owner: string, repo: string, username: string): Promise<CollaboratorRepositoryPermissions> {
  const installationId = await githubAppCache.getExistingAppRepoInstallation.get(owner, repo);
  return githubApp.getRepoUserPermissionLevel(installationId, owner, repo, username);
}

async function getRepository(owner: string, repo: string) {
  const installationId = await githubAppCache.getExistingAppRepoInstallation.get(owner, repo);
  return githubApp.getRepository(installationId, owner, repo);
}

async function getRepoBranches(owner: string, repo: string) {
  const installationId = await githubAppCache.getExistingAppRepoInstallation.get(owner, repo);
  return githubApp.getRepoBranches(installationId, owner, repo);
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
  getRepoUserPermissionLevel,
  readGitHubDirectoryTree: githubApp.readGitHubDirectoryTree // TODO Cache
}