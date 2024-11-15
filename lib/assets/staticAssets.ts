import normalizeUrl from "normalize-url";
import {
  AssetLocation, AssetProvider,
  AssetSourceRoot,
  itemAssetBasePath,
  itemAssetExtension,
  ResourceLocation
} from "@/lib/assets/index";
import resourceLocation from "@/lib/util/resourceLocation";
import fs from "fs";

async function resolveAsset(root: AssetSourceRoot<string>, id: ResourceLocation): Promise<AssetLocation | null> {
  const url = new URL(root.source);
  url.pathname += '/' + itemAssetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
  const src = url.protocol === 'file:' ? readLocalImage(url) : normalizeUrl(url.toString());
  return src === null ? null : { id: resourceLocation.toString(id), src };
}

function readLocalImage(file: any): string | null {
  try {
    const bitmap = fs.readFileSync(file);
    return 'data:image/png;base64,' + Buffer.from(bitmap).toString('base64');
  } catch (e) {
    return null;
  }
}

const staticAssets: AssetProvider<string> = {
  resolveAsset
};

export default staticAssets;