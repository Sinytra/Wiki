import { ProjectContext } from '@repo/shared/types/service';
import { AssetLocation } from '@repo/shared/assets';
import resourceLocation, { DEFAULT_NAMESPACE } from '@repo/shared/resourceLocation';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import builtinAssets from '@/lib/project/builtin/builtinAssets';
import commonNetwork from '@repo/shared/commonNetwork';

function getRemoteAsset(location: string, ctx: ProjectContext): AssetLocation | null {
  const resource = resourceLocation.parse(location);
  if (!resource) return null;

  // For builtin assets
  const builtin = getBuiltinAsset(location, resource, ctx);
  if (builtin != null) {
    return builtin;
  }

  return getRemoteAssetURL(location, ctx);
}

function getBuiltinAsset(
  location: string,
  resource: ResourceLocation,
  ctx: ProjectContext | null
): AssetLocation | null {
  if (!ctx || resource.namespace === DEFAULT_NAMESPACE) {
    const compatibleLocation = location.includes('/') ? location : prefixItemPath(location);
    const compatibleResource = resourceLocation.parse(compatibleLocation);
    if (!compatibleResource) return null;

    return builtinAssets.getAssetResource(compatibleResource);
  }
  return null;
}

function getRemoteAssetURL(location: string, { id, version }: ProjectContext): AssetLocation | null {
  const url = commonNetwork.constructApiUrl(`docs/${id}/asset/${location}`, {
    version
  });
  return {
    id: location,
    src: url
  };
}

function prefixItemPath(location: string) {
  const parsed = resourceLocation.parse(location);
  return !parsed
    ? location
    : resourceLocation.toString({
        namespace: parsed.namespace,
        path: 'item/' + parsed.path
      });
}

export default {
  getRemoteAsset,
  getBuiltinAsset,
  getRemoteAssetURL
};
