import normalizeUrl from "normalize-url";
import {
  AssetLocation, AssetProvider,
  AssetSourceRoot,
  itemAssetBasePath,
  itemAssetExtension,
  ResourceLocation
} from "@/lib/assets/index";
import resourceLocation from "@/lib/util/resourceLocation";

async function resolveAsset(root: AssetSourceRoot<string>, id: ResourceLocation): Promise<AssetLocation | null> {
  const url = new URL(root.source);
  url.pathname += '/' + itemAssetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
  const src = normalizeUrl(url.toString());
  return src === null ? null : { id: resourceLocation.toString(id), src };
}

const staticAssets: AssetProvider<string> = {
  resolveAsset
};

export default staticAssets;