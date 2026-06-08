import { unstable_cache } from 'next/cache';
import { promises as fs } from 'fs';
import { DEFAULT_LOCALE, DOCS_METADATA_FILE_NAME, FOLDER_METADATA_FILE_NAME } from '@repo/shared/constants';
import metadata, { DocumentationFolderMetadata, ValidationError } from './localMetadata';
import { FileTree } from '@repo/shared/types/service';
import { ProjectPlatforms } from '@repo/shared/types/platform';
import localFiles from './localFiles';
import env from '@repo/shared/env';
import markdown from '@repo/markdown';
import { FileTreeEntry } from '@sinytra/wiki-api-types';
import projectFormat, { ProjectFormat } from './format/projectFormat';

export interface LocalDocumentationSource {
  id: string;
  modid: string | null;
  platforms: ProjectPlatforms;
  is_community: boolean;
  path: string;
  format: ProjectFormat;
}

export interface LocalDocumentationFile {
  content: string;
  edit_url: string | null;
}

async function getProjectSource(slug: string): Promise<LocalDocumentationSource | null> {
  const localSources = await getLocalDocumentationSources();
  const src = localSources.find((s) => s.id === slug);
  return src || null;
}

export async function getLocalDocumentationSources(): Promise<LocalDocumentationSource[]> {
  const localPaths = process.env.LOCAL_DOCS_ROOTS || '';

  if (env.isPreview()) {
    return computeLocalDocumentationSources(localPaths);
  }

  const cache = unstable_cache(async (paths: string) => computeLocalDocumentationSources(paths), [], {
    tags: ['local_sources']
  });
  const cached = await cache(localPaths);

  // Re-add functions to format
  return cached.map((src) => ({
    ...src,
    format: projectFormat.determineProjectFormat(src.format.schema, src.format.root)
  }));
}

async function computeLocalDocumentationSources(paths: string): Promise<LocalDocumentationSource[]> {
  const roots = paths!.split(';');

  return Promise.all(
    roots
      .filter((p) => p.length > 0)
      .map(async (root) => {
        const file = await fs.readFile(`${root}/${DOCS_METADATA_FILE_NAME}`, 'utf8');
        const data = JSON.parse(file);
        metadata.validateMetadataFile(data);
        const format = projectFormat.determineProjectFormat(data.schema, root);

        return {
          format,
          id: data.id,
          modid: data.modid,
          platforms: {
            [data.platform as any]: data.slug, // TODO
            ...data.platforms
          },
          path: root,
          is_community: false,
          type: 'local'
        };
      })
  );
}

async function readDocsFile(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  path: string[],
  locale?: string,
  optional?: boolean
): Promise<LocalDocumentationFile | null> {
  try {
    const joined = path.join('/');
    const pagePath =
      type === 'content' ? source.format.getContentPagePath(joined) : source.format.getDocsPagePath(joined);
    const content = await readLocalizedFile(source, pagePath, locale);
    if (!content) {
      throw new Error(`Documentation file at ${path} not found`);
    }
    return content;
  } catch (e) {
    if (!optional) {
      throw e;
    }
  }

  return null;
}

async function getAvailableLocales(source: LocalDocumentationSource): Promise<string[]> {
  const cache = unstable_cache(async () => computeAvailableLocales(source), [`mod_locales:${source.id}`], {
    tags: [`mod_locales:${source.id}`]
  });
  return await cache();
}

async function computeAvailableLocales(source: LocalDocumentationSource): Promise<string[]> {
  const localeDirRegex = /^[a-z]{2}_[a-z]{2}$/;
  try {
    const translationsDirName = source.format.translationsDir;
    const translations = await localFiles.readShallowFileTree(source, translationsDirName);
    return translations
      .filter((t) => t.type === 'dir' && t.name.match(localeDirRegex))
      .map((t) => t.name.split('_')[0]!);
  } catch {
    return [];
  }
}

async function readDocsTree(source: LocalDocumentationSource, locale?: string): Promise<FileTree> {
  return readFileTree(source, 'docs', locale);
}

async function readContentTree(source: LocalDocumentationSource, locale?: string): Promise<FileTree> {
  return readFileTree(source, 'content', locale);
}

async function readFileTree(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  locale?: string
): Promise<FileTree> {
  const availableLocales = await getAvailableLocales(source);
  const actualLocale =
    locale === DEFAULT_LOCALE ? undefined : locale && locale in availableLocales ? locale : undefined;

  return resolveFileTree(source, type, actualLocale);
}

async function resolveFileTree(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  locale?: string
): Promise<FileTree> {
  const root = type === 'content' ? source.format.contentDir : source.format.docsDir;
  const converted = await localFiles.readFileTree(root);
  const docsIndexPageFileName = `${source.format.docsIndexPageName}.mdx`;

  const formatFiltered = source.format.filterDocsTree(converted);
  const filter: (e: FileTreeEntry) => boolean = (c) =>
    c.type === 'dir' ||
    (c.type === 'file' &&
      !c.name.startsWith('_') &&
      !c.name.startsWith('.') &&
      c.name !== DOCS_METADATA_FILE_NAME &&
      c.name !== docsIndexPageFileName &&
      (c.name === FOLDER_METADATA_FILE_NAME || c.name.endsWith('.mdx')));

  return processFileTree(source, filter, '', type, formatFiltered, locale);
}

async function processFileTree(
  source: LocalDocumentationSource,
  filter: (e: FileTreeEntry) => boolean,
  root: string,
  type: 'docs' | 'content',
  rawTree: FileTree,
  locale?: string
): Promise<FileTree> {
  const tree = rawTree.filter(filter);

  const metaFile = tree.find((t) => t.type === 'file' && t.name === FOLDER_METADATA_FILE_NAME);
  let metadata: DocumentationFolderMetadata | undefined;
  if (metaFile) {
    const metaFileSlug = (root.length === 0 ? '' : root + '/') + metaFile.name;
    const metaFilePath = source.format.getMetaFilePath(type, metaFileSlug);
    metadata = await parseFolderMetadataFile(source, metaFilePath, locale);
  }
  const order = Object.keys(metadata || {});

  return Promise.all(
    tree
      .filter((f) => f.type !== 'file' || f.name !== FOLDER_METADATA_FILE_NAME)
      .sort((a, b) => {
        if (!metadata) {
          // Show folders followed by files
          return a.type.localeCompare(b.type);
        } else if (!order.includes(a.name) || !order.includes(b.name)) {
          return 0;
        }
        return order.indexOf(a.name) - order.indexOf(b.name);
      })
      .map(async (entry) => {
        const basePath = root.length === 0 ? entry.name : root + '/' + entry.name;
        const actualPath = source.format.getDocsSlugFromPath(basePath);

        return {
          path: actualPath,
          name:
            metadata?.[entry.name]?.name || (await getPageTitleForFolderMeta(source, type, actualPath, entry, locale)),
          type: entry.type,
          children: entry.children
            ? await processFileTree(
                source,
                filter,
                (root.length === 0 ? '' : root + '/') + entry.name,
                type,
                entry.children,
                locale
              )
            : [],
          icon: metadata?.[entry.name]?.icon
        };
      })
  );
}

async function parseFolderMetadataFile(
  source: LocalDocumentationSource,
  path: string,
  locale?: string
): Promise<DocumentationFolderMetadata> {
  try {
    const file = await readLocalizedFile(source, path, locale);
    return metadata.parseFolderMetadata(file.content);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && e instanceof ValidationError) {
      throw e;
    }
    return {};
  }
}

async function readLocalizedFile(
  source: LocalDocumentationSource,
  path: string,
  locale?: string
): Promise<LocalDocumentationFile> {
  if (locale && locale !== DEFAULT_LOCALE) {
    const availableLocales = await getAvailableLocales(source);
    if (availableLocales.includes(locale)) {
      const translatedPath = source.format.getLocalizedFilePath(path, `${locale}_${locale}`);
      try {
        return await localFiles.readFileContents(source, translatedPath);
      } catch {
        // fallback to default locale
      }
    }
  }
  return await localFiles.readFileContents(source, path);
}

async function getPageTitleForFolderMeta(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  path: string,
  entry: FileTreeEntry,
  locale?: string
) {
  if (entry.type === 'file') {
    const content = await readDocsFile(source, type, path.split('/'), locale);
    if (content) {
      const frontmatter = await markdown.readProcessedFrontmatter(content.content);
      if (frontmatter?.title) {
        return frontmatter.title;
      }
    }
  }
  return capitalizeDefaultEntryName(entry.name);
}

function capitalizeDefaultEntryName(str: string) {
  if (str.startsWith('_') || str.startsWith('.')) {
    return str;
  }

  const words = str.split('.')[0]!.replaceAll(/[_-]/g, ' ').split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i]![0]!.toUpperCase() + words[i]!.substring(1);
  }
  return words.join(' ');
}

export default {
  getProjectSource,
  readDocsTree,
  readDocsFile,
  readContentTree
};
