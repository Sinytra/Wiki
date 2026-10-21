import fs from 'fs';
import { AssetLocation } from '@repo/shared/assets';
import resourceLocation from '@repo/shared/resourceLocation';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { assetPaths } from '@sinytra/wiki-wasm';
import { LocalDocumentationSource } from './localDocsPages';

async function resolveAsset(source: LocalDocumentationSource, id: ResourceLocation): Promise<AssetLocation | null> {
  const src = `/api/docs/${encodeURIComponent(source.id)}/asset/${encodeURIComponent(resourceLocation.toString(id))}`;
  return { src, id: resourceLocation.toString(id) };
}

function resolveAssetPath(source: LocalDocumentationSource, id: ResourceLocation): string | null {
  return (
    assetPaths(source.schema, id)
      .map((rel) => `${source.path}/${rel}`)
      .find((path) => fs.existsSync(path)) ?? null
  );
}

export default {
  resolveAsset,
  resolveAssetPath
};
