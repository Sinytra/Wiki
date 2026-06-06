import fs from 'fs';
import { AssetLocation, itemAssetExtension } from '@repo/shared/assets';
import resourceLocation from '@repo/shared/resourceLocation';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { LocalDocumentationSource } from './localDocsPages';

function getAssetResourcePath(assetsRoot: string, id: ResourceLocation): string {
  return assetsRoot + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
}

async function resolveAsset(source: LocalDocumentationSource, id: ResourceLocation): Promise<AssetLocation | null> {
  const assetsRoot = source.format.assetsDir;
  const path = getAssetResourcePath(assetsRoot, id);
  let src = readLocalImage(path);

  // Legacy asset path
  if (!src) {
    src = readLocalImage(
      getAssetResourcePath(assetsRoot, {
        namespace: 'item',
        path: `${id.namespace}/${id.path}`
      })
    );
  }

  return src === null ? null : { id: resourceLocation.toString(id), src };
}

function readLocalImage(file: any): string | null {
  try {
    const bitmap = fs.readFileSync(file);
    return 'data:image/png;base64,' + Buffer.from(bitmap).toString('base64');
  } catch {
    return null;
  }
}

export default {
  resolveAsset
};
