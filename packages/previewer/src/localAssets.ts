import fs from "fs";
import assets, {AssetLocation, AssetProvider} from "@repo/shared/assets";
import resourceLocation, {ResourceLocation} from "@repo/shared/resourceLocation";

async function resolveAsset(source: string, id: ResourceLocation): Promise<AssetLocation | null> {
  const path = source + '/' + assets.getAssetResourcePath(id);
  let src = readLocalImage(path);

  // Legacy asset path
  if (!src) {
    src = readLocalImage(source + '/' + assets.getAssetResourcePath({ namespace: 'item', path: `${id.namespace}/${id.path}` }));
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

const localAssets: AssetProvider = {
  resolveAsset
};

export default localAssets;