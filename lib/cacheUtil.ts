import {revalidatePath, revalidateTag, unstable_cache} from "next/cache";

const githubRequestsCacheId = 'github';
const githubAppRequestsCacheId = 'github_app';

function getModDocsLocalesCacheId(id: string): string {
  return `mod_locales:${id}`;
}

function invalidateDocs(id: string) {
  revalidateTag(getModDocsLocalesCacheId(id));
  revalidateTag('backend:' + id);

  revalidatePath(`/[locale]/(main)/mod/${id}/[version]`, 'layout');
}

interface DynamicCache<T extends Array<any>, U extends Promise<any>> {
  get: (...args: T) => U;
  invalidate: (...args: T) => void;
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
  getModDocsLocalesCacheId,
  invalidateDocs
};
