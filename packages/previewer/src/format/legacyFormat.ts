import { ProjectFormat } from './projectFormat';
import { ResourceLocation } from '@sinytra/wiki-api-types';
import { FileTree } from '@repo/shared/types/service';

const ASSETS_DIR = '.assets';
const LANG_DIR = 'lang';
const DATA_DIR = '.data';
const CONTENT_DIR = '.content';
const TRANSLATIONS_DIR = '.translated';
const DOCS_INDEX_PAGE = '_homepage';

export function createLegacyProjectFormat(root: string): ProjectFormat {
  const assetsDir = `${root}/${ASSETS_DIR}`;
  const contentDir = `${root}/${CONTENT_DIR}`;

  return {
    schema: '0',
    root,

    assetsDir,
    contentDir,
    docsDir: root,
    translationsDir: TRANSLATIONS_DIR,
    docsIndexPageName: DOCS_INDEX_PAGE,

    filterDocsTree(fileTree: FileTree): FileTree {
      return fileTree.filter((c) => c.type === 'dir' && !c.name.startsWith('.') && c.children && c.children.length > 0);
    },
    getDocsSlugFromPath(relPath: string): string {
      return relPath.endsWith('.mdx') ? relPath.substring(0, relPath.length - 4) : relPath;
    },
    getDocsIndexPagePath(): string {
      return this.getDocsPagePath(DOCS_INDEX_PAGE);
    },
    getDocsPagePath(slug: string): string {
      return `${slug}.mdx`;
    },
    getContentPagePath(slug: string): string {
      return `${CONTENT_DIR}/${slug}.mdx`;
    },
    getMetaFilePath(type: 'docs' | 'content', slug: string): string {
      return type === 'content' ? `${CONTENT_DIR}/${slug}` : slug;
    },
    getLocalizedFilePath(relative: string, locale: string): string {
      return `${TRANSLATIONS_DIR}/${locale}/${relative}`;
    },
    getItemAssetLocation(location: ResourceLocation): ResourceLocation {
      return location;
    },
    getItemPropertiesPath(_modid: string): string {
      return `${DATA_DIR}/properties.json`;
    },
    getLangFilePath(modid: string, lang: string): string {
      return `${ASSETS_DIR}/${modid}/${LANG_DIR}/${lang}.json`;
    }
  };
}
