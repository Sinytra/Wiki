import {DocumentationSource} from "@/lib/docs/sources";
import staticAssets from "@/lib/assets/staticAssets";
import resourceLocation from "@/lib/util/resourceLocation";
import localAssets from "@/lib/assets/localAssets";

type SourceType = 'static' | 'local';

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
  id: string;
  src: string;
}

export interface ResourceLocation {
  namespace: string;
  path: string;
}

export const assetBasePath: string = '.assets';
export const itemAssetBasePath: string = '.assets/item';
export const itemAssetExtension: string = '.png';

const assetProviders: { [key: string]: AssetProvider } = {
  static: staticAssets,
  local: localAssets
}

async function getBuiltinAssetSourceRoots(): Promise<AssetSourceRoots> {
  if (process.env.BUILTIN_ASSET_SOURCES) {
    return {
      minecraft: {
        type: 'static',
        source: process.env.BUILTIN_ASSET_SOURCES
      }
    }
  }
  return {};
}

async function getAssetResource(location: string, source?: DocumentationSource): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) {
    return null;
  }

  const systemRoots = await getBuiltinAssetSourceRoots();
  let root = systemRoots[resource.namespace];

  if (!root && source?.type === 'local') {
    root = { type: 'local', source: source.path }
  }

  if (root) {
    const provider = assetProviders[root.type];
    if (provider) {
      try {
        return provider.resolveAsset(root, resource);
      } catch (e) {
        console.error('Error resolving asset', location, e);
      }
    }
  }
  return null;
}

function getAssetResourcePath(id: ResourceLocation): string {
  return assetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
}

export default {
  getAssetResource,
  getAssetResourcePath
}