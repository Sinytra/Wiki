import {revalidateTag} from "next/cache";

const githubRequestsCacheId = 'github';
const githubAppRequestsCacheId = 'github_app';
const githubAppInstallCacheId = 'github_app_install';

function getModDocsTreeCacheId(id: string): string {
  return `mod_tree:${id}`;
}

function getModDocsSourceCacheId(id: string): string {
  return `mod_source:${id}`;
}

function clearModCaches(id: string) {
  revalidateTag(cacheUtil.getModDocsSourceCacheId(id));
  revalidateTag(cacheUtil.getModDocsTreeCacheId(id));
}

const cacheUtil = {
  githubRequestsCacheId,
  githubAppRequestsCacheId,
  githubAppInstallCacheId,
  getModDocsTreeCacheId,
  getModDocsSourceCacheId,
  clearModCaches
};

export default cacheUtil;