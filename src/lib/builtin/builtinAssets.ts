import normalizeUrl from "normalize-url";
import {assetBasePath, AssetLocation, itemAssetExtension} from "@repo/shared/assets";
import resourceLocation, {ResourceLocation} from "@repo/shared/resourceLocation";

async function resolveAsset(source: string, id: ResourceLocation): Promise<AssetLocation | null> {
  const url = new URL(source);
  url.pathname += '/' + assetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
  const src = normalizeUrl(url.toString());
  return src === null ? null : { id: resourceLocation.toString(id), src };
}

async function getAssetResource(location: ResourceLocation): Promise<AssetLocation | null> {
  const source = process.env.BUILTIN_ASSET_SOURCES;
  if (!source) return null;

  return resolveAsset(source, location);
}

export default {
  getAssetResource
}