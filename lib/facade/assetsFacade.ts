import {DocumentationSource} from "@/lib/docs/sources";
import {AssetLocation} from "@/lib/base/assets";
import resourceLocation from "@/lib/base/resourceLocation";
import assetsCache from "@/lib/cache/assetsCache";

async function getAssetResource(location: string, source?: DocumentationSource): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) {
    return null;
  }

  return await assetsCache.getDocumentationAsset.get(resource, source);
}

export default {
  getAssetResource
}
