import {revalidateTag, unstable_cache} from "next/cache";

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

function clearModCaches(id: string) {
  revalidateTag(getModDocsTreeCacheId(id));
  revalidateTag(getModDocsSourceCacheId(id));
  revalidateTag(getModDocsLocalesCacheId(id));
  revalidateTag(getRemoteProjectMetadataCacheId(id));
}

interface SimpleCache<T extends Array<any>, U extends Promise<any>> {
  get: (...args: T) => U;
  invalidate: () => void;
}

interface DynamicCache<T extends Array<any>, U extends Promise<any>> {
  get: (...args: T) => U;
  invalidate: (...args: T) => void;
}

export function wrapCached<
  T extends Array<any>,
  U extends Promise<any>
>(
  name: string,
  action: (...args: T) => U,
  expiry?: number | false
): SimpleCache<T, U> {
  const invalidate = (): void => revalidateTag(name);
  
  const get = (...args: T): U => {
    const cache = unstable_cache(action, [name], {tags: [name], revalidate: expiry});

    try {
      return cache(...args);
    } catch (e) {
      console.error(`Error querying cache '${name}'`, e);
      invalidate();
      throw e;
    }
  }

  return {get, invalidate};
}

export function wrapDynamicCached<
  T extends Array<any>,
  U extends Promise<any>
>(
  name: string,
  tag: (...args: T) => string,
  action: (...args: T) => U,
  expiry?: number | false
): DynamicCache<T, U> {
  const get = (...args: T): U => {
    const t = name + ':' + tag(...args);
    const cache = unstable_cache(action, [name], {tags: [t], revalidate: expiry});

    try {
      return cache(...args);
    } catch (e) {
      console.error(`Error querying cache '${name}'`, e);
      revalidateTag(t);
      throw e;
    }
  }

  const invalidate = (...args: T): void => {
    const t = name + ':' + tag(...args);
    revalidateTag(t);
  };

  return {get, invalidate};
}

export default {
  githubRequestsCacheId,
  githubAppRequestsCacheId,
  getModDocsTreeCacheId,
  getModDocsSourceCacheId,
  getModDocsLocalesCacheId,
  getRemoteProjectMetadataCacheId,
  clearModCaches
};
