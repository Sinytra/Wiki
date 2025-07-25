import {ResourceLocation} from '@repo/shared/resourceLocation';

export interface AssetLocation {
  id: string;
  src: string;
}

export interface AssetProvider {
  resolveAsset: (source: string, id: ResourceLocation) => Promise<AssetLocation | null>
}

export const assetBasePath: string = '.assets';
export const itemAssetExtension: string = '.png';

function getAssetResourcePath(id: ResourceLocation): string {
  return assetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
}

const assets = {
  getAssetResourcePath
};

export default assets;