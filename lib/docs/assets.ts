interface AssetSourceRoot {
  namespace: string;
  url: URL;
}

export interface AssetLocation {
  id: ResourceLocation;
  url: URL;
}

interface AssetSourceRoots {
  [key: string]: AssetSourceRoot 
}

interface ResourceLocation {
  namespace: string;
  path: string;
}

export function resourceLocationToString(location: ResourceLocation): string {
  return `${location.namespace}:${location.path}`;
}

const itemAssetBasePath: string = '/assets/item/';
const assetExtension: string = '.png';

function getAssetResource(location: string): AssetLocation | null {
  const resource = parseResourceLocation(location);
  if (!resource) {
    return null;
  }

  const roots = getKnownAssetRoots();
  const root = roots[resource.namespace];
  if (root) {
    const url = new URL(root.url);
    url.pathname = itemAssetBasePath + resource.namespace + '/' + resource.path + assetExtension;
    return { id: resource, url };
  }
  return null;
}

function getKnownAssetRoots(): AssetSourceRoots {
  let roots: AssetSourceRoots = {};
  if (process.env.ASSET_SOURCES) {
    const paths = process.env.ASSET_SOURCES.split(';');
    paths.filter(p => p.includes(':')).forEach(path => {
      const splitter = path.indexOf(':');
      const namespace = path.substring(0, splitter);
      const location = path.substring(splitter + 1);
      try {
        const url = new URL(location);
        roots[namespace] = { namespace: namespace, url };
      } catch (e) {
        // Invalid URL
      }
    });
  }
  return roots;
}

function parseResourceLocation(loc: string): ResourceLocation | null {
  if (loc.length === 0) {
    return null;
  }
  if (loc.includes(':')) {
    const parts = loc.split(':');
    return { namespace: parts[0], path: parts[1] };
  }
  return { namespace: 'minecraft', path: loc };
}

const assets = {
  getAssetURL: getAssetResource
};

export default assets;