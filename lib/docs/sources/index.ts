import {promises as fs} from 'fs';
import {unstable_cache} from "next/cache";
import {localDocsSource} from "@/lib/docs/sources/localSource";
import localPreview from "@/lib/docs/localPreview";
import metadata, {DocumentationFolderMetadata, ValidationError} from "@/lib/docs/metadata";
import {DEFAULT_LOCALE, DOCS_METADATA_FILE_NAME, FOLDER_METADATA_FILE_NAME, HOMEPAGE_FILE_PATH} from "@/lib/constants";
import {FileTree, ProjectPlatforms} from "@/lib/service";

type SourceType = 'local';

export interface DocumentationSource {
  id: string;
  platforms: ProjectPlatforms;
  is_community: boolean;

  path: string;
  type: SourceType;
}

export interface DocumentationFile {
  content: string;
  edit_url: string | null;
  updated_at?: Date;
}

export interface DocumentationSourceProvider<T extends DocumentationSource> {
  readFileContents: (source: T, path: string) => Promise<DocumentationFile>;
  readFileTree: (source: T) => Promise<FileTree>;
  readShallowFileTree: (source: T, path: string) => Promise<FileTree>;
}

export interface LocalDocumentationSource extends DocumentationSource {
  type: 'local';
}

const documentationProviders: { [key: string]: DocumentationSourceProvider<any> } = {
  local: localDocsSource
}

function getDocumentationSourceProvider<T extends DocumentationSource>(source: DocumentationSource): DocumentationSourceProvider<T> {
  const provider = documentationProviders[source.type];
  if (!provider) {
    throw new Error(`Unknown documentation source type '${source.type}'`);
  }
  return provider;
}

async function readDocsFile(source: DocumentationSource, path: string[], locale?: string, optional?: boolean): Promise<DocumentationFile | null> {
  const provider = getDocumentationSourceProvider(source);

  try {
    const content = await readLocalizedFile(provider, source, `${path.join('/')}.mdx`, locale);
    if (!content) {
      throw new Error(`Documentation file at ${path} not found`);
    }
    return { ...content, updated_at: content.updated_at ? new Date(content.updated_at) : undefined };
  } catch (e) {
    if (!optional) {
      throw e;
    }
  }

  return null;
}

async function parseFolderMetadataFile(source: DocumentationSource, path: string, locale?: string): Promise<DocumentationFolderMetadata> {
  const provider = getDocumentationSourceProvider(source);

  try {
    const file = await readLocalizedFile(provider, source, path, locale);
    return metadata.parseFolderMetadata(file.content);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && e instanceof ValidationError) {
      throw e;
    }
    return {};
  }
}

async function readLocalizedFile(provider: DocumentationSourceProvider<any>, source: DocumentationSource, path: string, locale?: string): Promise<DocumentationFile> {
  if (locale && locale !== DEFAULT_LOCALE) {
    const availableLocales = await getAvailableDocsLocales(source, provider);
    if (availableLocales.includes(locale)) {
      const localeFolder = `.translated/${locale}_${locale}/`;
      try {
        return await provider.readFileContents(source, localeFolder + path);
      } catch (e) {
        // fallback to default locale
      }
    }
  }
  return await provider.readFileContents(source, path);
}

async function getAvailableLocales(source: DocumentationSource) {
  const provider = getDocumentationSourceProvider(source);
  return await getAvailableDocsLocales(source, provider);
}

async function readDocsTree(source: DocumentationSource, locale?: string): Promise<FileTree> {
  const provider = getDocumentationSourceProvider(source);
  const availableLocales = await getAvailableDocsLocales(source, provider);
  const actualLocale = locale === DEFAULT_LOCALE ? undefined : locale && locale in availableLocales ? locale : undefined;

  return resolveDocsTree(source, actualLocale);
}

async function resolveDocsTree(source: DocumentationSource, locale?: string): Promise<FileTree> {
  const provider = getDocumentationSourceProvider(source);
  const converted = await provider.readFileTree(source);

  const filtered = converted.filter(c =>
    c.type === 'file' && c.name !== DOCS_METADATA_FILE_NAME && c.name !== `${HOMEPAGE_FILE_PATH}.mdx` && (c.name === FOLDER_METADATA_FILE_NAME || c.name.endsWith('.mdx'))
    || c.type === 'dir' && !c.name.startsWith('.') && !c.name.startsWith('(') && c.children && c.children.length > 0);
  return processFileTree(source, '', filtered, locale);
}

async function readShallowFileTree(source: DocumentationSource, path: string): Promise<FileTree> {
  const provider = getDocumentationSourceProvider(source);
  return await provider.readShallowFileTree(source, path);
}

async function processFileTree(source: DocumentationSource, root: string, tree: FileTree, locale?: string): Promise<FileTree> {
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

async function getLocalDocumentationSources(): Promise<DocumentationSource[]> {
  const localPaths = process.env.LOCAL_DOCS_ROOTS || '';

  if (localPreview.isEnabled()) {
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

async function computeLocalDocumentationSources(paths: string): Promise<DocumentationSource[]> {
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

async function getAvailableDocsLocales(source: DocumentationSource, provider: DocumentationSourceProvider<any>): Promise<string[]> {
  const cache = unstable_cache(
    async () => computeAvailableLocales(source, provider),
    [`mod_locales:${source.id}`],
    {
      tags: [`mod_locales:${source.id}`]
    }
  );
  return await cache();
}

async function computeAvailableLocales(source: DocumentationSource, provider: DocumentationSourceProvider<any>): Promise<string[]> {
  const localeDirRegex = /^[a-z]{2}_[a-z]{2}$/;
  try {
    const translations = await provider.readShallowFileTree(source, '.translated');
    return translations.filter(t => t.type === 'dir' && t.name.match(localeDirRegex)).map(t => t.name.split('_')[0]);
  } catch (e) {
    return [];
  }
}

function capitalizeDefaultEntryName(str: string) {
  const words = str.split('.')[0].replaceAll(/[_\-]/g, ' ').split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }
  return words.join(' ');
}

export default {
  readDocsTree,
  readDocsFile,
  readShallowFileTree,
  getLocalDocumentationSources,
  getAvailableLocales
};
