import {revalidateTag} from "next/cache";

const githubRequestsCacheId = 'github';
const githubAppRequestsCacheId = 'github_app';

function getModDocsTreeCacheId(id: string): string {
  return `mod_tree:${id}`;
}

function getModDocsSourceCacheId(id: string): string {
  return `mod_source:${id}`;
}

function getModDocsLocalesCacheId(id: string): string {
  return `mod_locales:${id}`;
}

function getRemoteProjectMetadataCacheId(id: string): string {
  return `remote_project_metadata:${id}`;
}

function getGithubAppRepoInstallCacheId(owner: string): string {
  return `repo_install:${owner}`;
}

function getGithubAppUserInstallCacheId(owner: string): string {
  return `user_install:${owner}`;
}

function clearModCaches(id: string) {
  revalidateTag(cacheUtil.getModDocsTreeCacheId(id));
  revalidateTag(cacheUtil.getModDocsSourceCacheId(id));
  revalidateTag(cacheUtil.getModDocsLocalesCacheId(id));
  revalidateTag(cacheUtil.getRemoteProjectMetadataCacheId(id));
}

const cacheUtil = {
  githubRequestsCacheId,
  githubAppRequestsCacheId,
  getGithubAppUserInstallCacheId,
  getGithubAppRepoInstallCacheId,
  getModDocsTreeCacheId,
  getModDocsSourceCacheId,
  getModDocsLocalesCacheId,
  getRemoteProjectMetadataCacheId,
  clearModCaches
};

export default cacheUtil;