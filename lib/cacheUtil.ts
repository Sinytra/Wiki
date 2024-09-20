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

function getGithubAppRepoInstallCacheId(owner: string): string {
  return `repo_install:${owner}`;
}

function getGithubAppUserInstallCacheId(owner: string): string {
  return `user_install:${owner}`;
}

function clearModCaches(id: string) {
  revalidateTag(cacheUtil.getModDocsSourceCacheId(id));
  revalidateTag(cacheUtil.getModDocsTreeCacheId(id));
}

const cacheUtil = {
  githubRequestsCacheId,
  githubAppRequestsCacheId,
  getGithubAppUserInstallCacheId,
  getGithubAppRepoInstallCacheId,
  getModDocsTreeCacheId,
  getModDocsSourceCacheId,
  getModDocsLocalesCacheId,
  clearModCaches
};

export default cacheUtil;