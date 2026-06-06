import { createLegacyProjectFormat } from './legacyFormat';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { createV1ProjectFormat } from './v1Format';
import { FileTree } from '@repo/shared/types/service';

export interface ProjectFormat {
  schema: string;
  root: string;

  assetsDir: string;
  contentDir: string;
  docsDir: string;
  translationsDir: string;
  docsIndexPageName: string;

  filterDocsTree(fileTree: FileTree): FileTree;

  getDocsSlugFromPath(relPath: string): string;

  /** Returns relative path to content root, non-localized */
  getDocsPagePath(slug: string): string;

  getDocsIndexPagePath(): string;

  getContentPagePath(slug: string): string;

  getMetaFilePath(type: 'docs' | 'content', slug: string): string;

  getLocalizedFilePath(relative: string, locale: string): string;

  getItemAssetLocation(location: ResourceLocation): ResourceLocation;

  getItemPropertiesPath(modid: string): string;

  getLangFilePath(modid: string, lang: string): string;
}

function determineProjectFormat(schema: string | null | undefined, root: string): ProjectFormat {
  if (schema === '1') {
    return createV1ProjectFormat(root);
  }
  return createLegacyProjectFormat(root);
}

export default {
  determineProjectFormat
};
