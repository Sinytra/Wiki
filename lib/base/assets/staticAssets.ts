import {readLocalImage} from "@/lib/serverUtils";
import normalizeUrl from "normalize-url";
import {
  AssetLocation, AssetProvider,
  AssetSourceRoot,
  itemAssetBasePath,
  itemAssetExtension,
  ResourceLocation
} from "@/lib/base/assets/index";

async function resolveAsset(root: AssetSourceRoot<string>, id: ResourceLocation): Promise<AssetLocation | null> {
  const url = new URL(root.source);
  url.pathname += '/' + itemAssetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
  const src = url.protocol === 'file:' ? await readLocalImage(url) : normalizeUrl(url.toString());
  return src === null ? null : { id, src };
}

const staticAssets: AssetProvider<string> = {
  resolveAsset
};

export default staticAssets;