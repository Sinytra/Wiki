import {unstable_cache} from "next/cache";
import {promises as fs} from "fs";
import {DEFAULT_LOCALE, DOCS_METADATA_FILE_NAME, FOLDER_METADATA_FILE_NAME, HOMEPAGE_FILE_PATH} from "@repo/shared/constants";
import metadata, {DocumentationFolderMetadata, ValidationError } from "./localMetadata";
import {FileTree} from "@repo/shared/types/service";
import {ProjectPlatforms} from "@repo/shared/types/platform";
import localFiles from "./localFiles";
import env from "@repo/shared/env";

export interface LocalDocumentationSource {
  id: string;
  platforms: ProjectPlatforms;
  is_community: boolean;
  path: string;
}

export interface LocalDocumentationFile {
  content: string;
  edit_url: string | null;
}

async function getProjectSource(slug: string): Promise<LocalDocumentationSource | null> {
  const localSources = await getLocalDocumentationSources();
  const src = localSources.find(s => s.id === slug);
  return src || null;
}

export async function getLocalDocumentationSources(): Promise<LocalDocumentationSource[]> {
  const localPaths = process.env.LOCAL_DOCS_ROOTS || '';

  if (env.isPreview()) {
    return computeLocalDocumentationSources(localPaths);
  }

  const cache = unstable_cache(
    async (paths: string) => computeLocalDocumentationSources(paths),
    [],
    {
      tags: ['local_sources']
    }
  );
  return await cache(localPaths);
}

async function computeLocalDocumentationSources(paths: string): Promise<LocalDocumentationSource[]> {
  const roots = paths!.split(';');

  return Promise.all(roots.filter(p => p.length > 0).map(async (root) => {
    const file = await fs.readFile(`${root}/${DOCS_METADATA_FILE_NAME}`, 'utf8');
    const data = JSON.parse(file);
    metadata.validateMetadataFile(data);

    return {
      id: data.id,
      platforms: {
        [data.platform as any]: data.slug, // TODO
        ...data.platforms
      },
      path: root,
      is_community: false,
      type: 'local'
    };
  }));
}

async function readDocsFile(source: LocalDocumentationSource, path: string[], locale?: string, optional?: boolean): Promise<LocalDocumentationFile | null> {
  try {
    const content = await readLocalizedFile(source, `${path.join('/')}.mdx`, locale);
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
  const cache = unstable_cache(
    async () => computeAvailableLocales(source),
    [`mod_locales:${source.id}`],
    {
      tags: [`mod_locales:${source.id}`]
    }
  );
  return await cache();
}

async function computeAvailableLocales(source: LocalDocumentationSource): Promise<string[]> {
  const localeDirRegex = /^[a-z]{2}_[a-z]{2}$/;
  try {
    const translations = await localFiles.readShallowFileTree(source, '.translated');
    return translations
      .filter(t => t.type === 'dir' && t.name.match(localeDirRegex))
      .map(t => t.name.split('_')[0]!);
  } catch {
    return [];
  }
}

async function readDocsTree(source: LocalDocumentationSource, locale?: string): Promise<FileTree> {
  const availableLocales = await getAvailableLocales(source);
  const actualLocale = locale === DEFAULT_LOCALE ? undefined : locale && locale in availableLocales ? locale : undefined;

  return resolveDocsTree(source, actualLocale);
}

async function resolveDocsTree(source: LocalDocumentationSource, locale?: string): Promise<FileTree> {
  const converted = await localFiles.readFileTree(source);

  const filtered = converted.filter(c =>
    c.type === 'file' && c.name !== DOCS_METADATA_FILE_NAME && c.name !== `${HOMEPAGE_FILE_PATH}.mdx` && (c.name === FOLDER_METADATA_FILE_NAME || c.name.endsWith('.mdx'))
    || c.type === 'dir' && !c.name.startsWith('.') && !c.name.startsWith('(') && c.children && c.children.length > 0);

  return processFileTree(source, '', filtered, locale);
}

async function processFileTree(source: LocalDocumentationSource, root: string, tree: FileTree, locale?: string): Promise<FileTree> {
  const metaFile = tree.find(t => t.type === 'file' && t.name === FOLDER_METADATA_FILE_NAME);
  const metadata = metaFile ? await parseFolderMetadataFile(source, (root.length === 0 ? '' : root + '/') + metaFile.name, locale) : undefined;
  const order = Object.keys(metadata || {});
  return Promise.all(tree
    .filter(f => f.type !== 'file' || f.name !== FOLDER_METADATA_FILE_NAME)
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
      return {
        path: basePath.endsWith('.mdx') ? basePath.substring(0, basePath.length - 4) : basePath,
        name: metadata?.[entry.name]?.name || capitalizeDefaultEntryName(entry.name),
        type: entry.type,
        children: entry.children ? await processFileTree(source, (root.length === 0 ? '' : root + '/') + entry.name, entry.children, locale) : [],
        icon: metadata?.[entry.name]?.icon
      }
    }));
}

async function parseFolderMetadataFile(source: LocalDocumentationSource, path: string, locale?: string): Promise<DocumentationFolderMetadata> {
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

async function readLocalizedFile(source: LocalDocumentationSource, path: string, locale?: string): Promise<LocalDocumentationFile> {
  if (locale && locale !== DEFAULT_LOCALE) {
    const availableLocales = await getAvailableLocales(source);
    if (availableLocales.includes(locale)) {
      const localeFolder = `.translated/${locale}_${locale}/`;
      try {
        return await localFiles.readFileContents(source, localeFolder + path);
      } catch (e) {
        // fallback to default locale
      }
    }
  }
  return await localFiles.readFileContents(source, path);
}

function capitalizeDefaultEntryName(str: string) {
  const words = str.split('.')[0]!.replaceAll(/[_\-]/g, ' ').split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i]![0]!.toUpperCase() + words[i]!.substring(1);
  }
  return words.join(' ');
}

export default {
  getProjectSource,
  getAvailableLocales,
  readDocsTree,
  readDocsFile
}