import sources, {DocumentationSource, RemoteDocumentationSource} from "@/lib/docs/sources";
import staticAssets from "@/lib/base/assets/staticAssets";
import githubAssets from "@/lib/base/assets/githubAssets";
import githubFacade from "@/lib/facade/githubFacade";
import assetsCache from "@/lib/cache/assetsCache";

type SourceType = 'static' | 'github';
const rawGithubUserContent: string = 'https://raw.githubusercontent.com';

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

async function getBuiltinAssetSourceRoots(): Promise<AssetSourceRoots> {
  return process.env.ASSET_SOURCES ? await assetsCache.getBuiltinAssetSources.get(process.env.ASSET_SOURCES) : {};
}

async function getBuiltinAssetSources(sourcePaths: string) {
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
}

async function getAssetResource(resource: ResourceLocation, source?: DocumentationSource): Promise<AssetLocation | null> {
  const sytemRoots = await getBuiltinAssetSourceRoots();
  let root = sytemRoots[resource.namespace];
  
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
  const isRemote = source.type === 'github';

  // Check remote static availability (fast)
  if (isRemote) {
    const remote = source as RemoteDocumentationSource;
    // TODO Find out why caching this method fails
    if (await githubFacade.isRepositoryPublic(remote.repo)) {
      const url = `${rawGithubUserContent}/${remote.repo}/${remote.branch}/${source.path}/`;
      return { source: url, type: 'static' }
    }
  }

  const sourceAssets = await sources.readShallowFileTree(source, itemAssetBasePath);
  let roots: AssetSourceRoots = {};
  sourceAssets.filter(f => f.type === 'directory').forEach(f =>
    roots[f.name] = {
      source: isRemote ? source : f.url!,
      type: isRemote ? 'github' : 'static'
    }
  );

  return roots[namespace];
}

const index = {
  getAssetResource,
  getBuiltinAssetSources
};

export default index;