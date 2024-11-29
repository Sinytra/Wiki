import sources, {DocumentationSource} from "@/lib/docs/sources";
import staticAssets from "@/lib/assets/staticAssets";
import {FileTreeEntry} from "@/lib/service";
import resourceLocation from "@/lib/util/resourceLocation";

type SourceType = 'static';

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

export type LocalFileTree = LocalFileTreeEntry[];

export interface LocalFileTreeEntry extends FileTreeEntry {
  url: string;
}

export const itemAssetBasePath: string = '.assets/item';
export const itemAssetExtension: string = '.png';

const assetProviders: { [key: string]: AssetProvider } = {
  static: staticAssets
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

  return await computeAssetResource(resource, source);
}

async function computeAssetResource(resource: ResourceLocation, source?: DocumentationSource): Promise<AssetLocation | null> {
  const systemRoots = await getBuiltinAssetSourceRoots();
  let root = systemRoots[resource.namespace];

  if (!root && source) {
    root = await getDocumentationSourceAssetRoot(source, resource.namespace);
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

async function getDocumentationSourceAssetRoot(source: DocumentationSource, namespace: string): Promise<AssetSourceRoot> {
  const sourceAssets = await sources.readShallowFileTree(source, itemAssetBasePath) as LocalFileTree;
  let roots: AssetSourceRoots = {};
  sourceAssets.filter(f => f.type === 'dir').forEach(f =>
    roots[f.name] = {
      source: f.url!,
      type: 'static'
    }
  );
  return roots[namespace];
}

export default {
  getAssetResource
}