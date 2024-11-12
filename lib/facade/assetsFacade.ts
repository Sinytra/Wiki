import {DocumentationSource} from "@/lib/docs/sources";
import assets, {AssetLocation} from "../assets";
import resourceLocation from "@/lib/util/resourceLocation";

async function getAssetResource(location: string, source?: DocumentationSource): Promise<AssetLocation | null> {
  const resource = resourceLocation.parse(location);
  if (!resource) {
    return null;
  }

  return await assets.getAssetResource(resource, source);
}

export default {
  getAssetResource
}
