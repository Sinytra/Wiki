import fs from 'fs';
import { AssetLocation, itemAssetExtension } from '@repo/shared/assets';
import resourceLocation from '@repo/shared/resourceLocation';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { LocalDocumentationSource } from './localDocsPages';

function getAssetResourcePath(assetsRoot: string, id: ResourceLocation): string {
  return assetsRoot + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
}

async function resolveAsset(source: LocalDocumentationSource, id: ResourceLocation): Promise<AssetLocation | null> {
  const src = `/api/docs/${encodeURIComponent(source.id)}/asset/${encodeURIComponent(resourceLocation.toString(id))}`;
  return { src, id: resourceLocation.toString(id) };
}

function resolveAssetPath(source: LocalDocumentationSource, id: ResourceLocation): string | null {
  const assetsRoot = source.format.assetsDir;
  const path = getAssetResourcePath(assetsRoot, id);
  if (fs.existsSync(path)) {
    return path;
  }

  // Legacy asset path
  const legacyPath = getAssetResourcePath(assetsRoot, {
    namespace: 'item',
    path: `${id.namespace}/${id.path}`
  });
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }

  return null;
}

export default {
  resolveAsset,
  resolveAssetPath
};
