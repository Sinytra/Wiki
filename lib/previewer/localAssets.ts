import fs from "fs";
import assets, {AssetLocation, AssetProvider, AssetSourceRoot, ResourceLocation} from "@/lib/assets";
import resourceLocation from "@/lib/util/resourceLocation";

async function resolveAsset(root: AssetSourceRoot<string>, id: ResourceLocation): Promise<AssetLocation | null> {
  const path = root.source + '/' + assets.getAssetResourcePath(id);
  let src = readLocalImage(path);

  // Legacy asset path
  if (!src) {
    src = readLocalImage(root.source + '/' + assets.getAssetResourcePath({ namespace: 'item', path: `${id.namespace}/${id.path}` }));
  }

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

const localAssets: AssetProvider<string> = {
  resolveAsset
};

export default localAssets;