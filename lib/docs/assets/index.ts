import {unstable_cache} from "next/cache";
import sources, {DocumentationSource} from "@/lib/docs/sources";
import staticAssets from "@/lib/docs/assets/staticAssets";
import githubAssets from "@/lib/docs/assets/githubAssets";

type SourceType = 'static' | 'github';

interface AssetSourceRoots {
  [key: string]: AssetSourceRoot
}

export interface AssetSourceRoot<T = any> {
  type: SourceType;
  source: T
}

export interface AssetProvider<T = any> {
  resolveAsset: (root: AssetSourceRoot<T>, id: ResourceLocation) => Promise<AssetLocation | null>
}

export interface AssetLocation {
  id: ResourceLocation;
  src: string;
}

export interface ResourceLocation {
  namespace: string;
  path: string;
}

export const itemAssetBasePath: string = '.assets/item';
export const itemAssetExtension: string = '.png';

const assetProviders: { [key in SourceType]: AssetProvider } = {
  static: staticAssets,
  github: githubAssets
}

const systemAssetSourcesCache = unstable_cache(
  async (sourcePaths: string) => {
    let roots: AssetSourceRoots = {};
    const paths = sourcePaths.split(';');
    paths.filter(p => p.includes(':')).forEach(path => {
      const splitter = path.indexOf(':');
      const namespace = path.substring(0, splitter);
      const location = path.substring(splitter + 1);
      try {
        const url = new URL(location);
        roots[namespace] = {source: url.toString(), type: 'static'};
      } catch (e) {
        // Invalid URL
      }
    });
    return roots;
  },
  [],
  {
    tags: ['system_asset_sources']
  }
);

export function resourceLocationToString(location: ResourceLocation): string {
  return `${location.namespace}:${location.path}`;
}

async function getAssetResource(location: string, source?: DocumentationSource): Promise<AssetLocation | null> {
  const resource = parseResourceLocation(location);
  if (!resource) {
    return null;
  }

  const sytemRoots = await getKnownAssetRoots();
  let root = sytemRoots[resource.namespace];

  if (!root && source) {
    const sourceRoots = await getDocumentationSourceAssets(source);
    root = sourceRoots[resource.namespace];
  }

  if (root) {
    const provider = assetProviders[root.type];
    if (provider) {
      return provider.resolveAsset(root, resource);
    }
  }
  return null;
}

async function getKnownAssetRoots(): Promise<AssetSourceRoots> {
  return process.env.ASSET_SOURCES ? await systemAssetSourcesCache(process.env.ASSET_SOURCES) : {};
}

// TODO Cache
async function getDocumentationSourceAssets(source: DocumentationSource): Promise<AssetSourceRoots> {
  const remote = source.type === 'github';
  const sourceAssets = await sources.readShallowFileTree(source, itemAssetBasePath);
  let roots: AssetSourceRoots = {};
  sourceAssets.filter(f => f.type === 'directory').forEach(f =>
    roots[f.name] = {
      source: remote ? source : f.url!,
      type: remote ? 'github' : 'static'
    }
  );
  return roots;
}

function parseResourceLocation(loc: string): ResourceLocation | null {
  if (loc.length === 0) {
    return null;
  }
  if (loc.includes(':')) {
    const parts = loc.split(':');
    return {namespace: parts[0], path: parts[1]};
  }
  return {namespace: 'minecraft', path: loc};
}

const index = {
  getAssetResource
};

export default index;