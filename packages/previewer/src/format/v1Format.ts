import { ProjectFormat } from './projectFormat';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { FileTree } from '@repo/shared/types/service';

const ASSETS_DIR = 'assets';
const LANG_DIR = 'lang';
const DATA_DIR = 'data';
const DOCS_DIR = 'docs';
const CONTENT_DIR = 'content';
const TRANSLATIONS_DIR = 'translated';
const DOCS_INDEX_PAGE = '_index';
const ITEM_PROPERTIES_FILE = 'properties/item.json';

export function createV1ProjectFormat(root: string): ProjectFormat {
  const assetsDir = `${root}/${ASSETS_DIR}`;
  const contentDir = `${root}/${CONTENT_DIR}`;
  const docsDir = `${root}/${DOCS_DIR}`;

  return {
    schema: '1',
    root,

    assetsDir,
    contentDir,
    docsDir,
    translationsDir: TRANSLATIONS_DIR,
    docsIndexPageName: DOCS_INDEX_PAGE,

    filterDocsTree(fileTree: FileTree): FileTree {
      return fileTree;
    },
    getDocsSlugFromPath(relPath: string): string {
      return relPath.endsWith('.mdx') ? relPath.substring(0, relPath.length - 4) : relPath;
    },
    getDocsIndexPagePath(): string {
      return this.getDocsPagePath(DOCS_INDEX_PAGE);
    },
    getDocsPagePath(slug: string): string {
      return `${DOCS_DIR}/${slug}.mdx`;
    },
    getContentPagePath(slug: string): string {
      return `${CONTENT_DIR}/${slug}.mdx`;
    },
    getMetaFilePath(type: 'docs' | 'content', slug: string): string {
      return type === 'content' ? `${CONTENT_DIR}/${slug}` : `${DOCS_DIR}/${slug}`;
    },
    getLocalizedFilePath(relative: string, locale: string): string {
      return `${TRANSLATIONS_DIR}/${locale}/${relative}`;
    },
    getItemAssetLocation(location: ResourceLocation): ResourceLocation {
      return { namespace: location.namespace, path: `item/${location.path}` };
    },
    getItemPropertiesPath(modid: string): string {
      return `${DATA_DIR}/${modid}/${ITEM_PROPERTIES_FILE}`;
    },
    getLangFilePath(modid: string, lang: string): string {
      return `${ASSETS_DIR}/${modid}/${LANG_DIR}/${lang}.json`;
    }
  };
}
