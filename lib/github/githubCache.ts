import githubApp from "@/lib/github/githubApp";
import {wrapDynamicCached} from "@/lib/cacheUtil";
import github from "@/lib/github/github";

const getExistingAppRepoInstallation = wrapDynamicCached(
  'existing_app_repo_installation',
  (owner, repo) => owner,
  githubApp.getExistingAppRepoInstallation
);

const getUserAccessibleInstallations = wrapDynamicCached(
  'accessible_user_installations',
  (owner, token) => owner,
  (owner: string, token: string) => github.getUserAccessibleInstallations(token),
  360
);

const getRepositoryFileContents = wrapDynamicCached(
  'repository_file_contents',
  (installationId, owner, repo, branch, path) => `${owner}/${repo}/${branch}/${path}`,
  githubApp.getRepositoryFileContents
)

const getRepositoryContents = wrapDynamicCached(
  'repository_contents',
  (installationId, owner, repo, branch, path) => `${owner}/${repo}/${branch}/${path}`,
  githubApp.getRepositoryContents
)

export default {
  getExistingAppRepoInstallation,
  getUserAccessibleInstallations,
  getRepositoryFileContents,
  getRepositoryContents
}