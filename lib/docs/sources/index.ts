import {promises as fs} from 'fs';
import database from "../../base/database";
import {ModPlatform} from "@/lib/platforms";
import {unstable_cache} from "next/cache";
import {localDocsSource} from "@/lib/docs/sources/localSource";
import {githubDocsSource} from "@/lib/docs/sources/githubSource";
import cacheUtil from "@/lib/cacheUtil";
import localPreview from "@/lib/docs/localPreview";
import {redirect, RedirectType} from "next/navigation";
import metadata, {DocumentationFolderMetadata, ValidationError} from "@/lib/docs/metadata";
import {
  DEFAULT_DOCS_VERSION,
  DOCS_METADATA_FILE_NAME,
  FOLDER_METADATA_FILE_NAME,
  HOMEPAGE_FILE_PATH
} from "@/lib/constants";
import githubFacade from "@/lib/facade/githubFacade";

const defaultLocale = 'en';

type SourceType = 'local' | 'github';

export interface DocumentationSource {
  id: string;
  platform: ModPlatform;
  slug: string;

  path: string;
  type: SourceType;
  is_community: boolean;
}

export interface DocumentationFile {
  content: string;
  edit_url: string | null;
  updated_at: Date | null;
}

export interface DocumentationSourceProvider<T extends DocumentationSource> {
  readFileContents: (source: T, path: string) => Promise<DocumentationFile>;
  readFileTree: (source: T) => Promise<FileTreeNode[]>;
  readShallowFileTree: (source: T, path: string) => Promise<FileTreeNode[]>;
}

export interface LocalDocumentationSource extends DocumentationSource {
  type: 'local';
}

export interface RemoteDocumentationSource extends DocumentationSource {
  type: 'github';
  repo: string;
  branch: string;
  editable: boolean;

  branches?: Record<string, string>;
}

export interface FileTreeNode {
  name: string;
  path: string;
  url?: string;
  type: 'directory' | 'file';
  children: FileTreeNode[];
  icon?: string;
}

const documentationProviders: { [key in SourceType]: DocumentationSourceProvider<any> } = {
  local: localDocsSource,
  github: githubDocsSource
}

function getDocumentationSourceProvider<T extends DocumentationSource>(source: DocumentationSource): DocumentationSourceProvider<T> {
  const provider = documentationProviders[source.type];
  if (!provider) {
    throw new Error(`Unknown documentation source type '${source.type}'`);
  }
  return provider;
}

async function readDocsFile(source: DocumentationSource, path: string[], locale?: string): Promise<DocumentationFile> {
  const provider = getDocumentationSourceProvider(source);

  const content = await readLocalizedFile(provider, source, `${path.join('/')}.mdx`, locale);
  if (!content) {
    throw new Error(`Documentation file at ${path} not found`);
  }

  return content;
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
  if (locale && locale !== defaultLocale) {
    const availableLocales = await getAvailableLocales(source, provider);
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

async function readDocsTree(source: DocumentationSource, locale?: string): Promise<FileTreeNode[]> {
  const provider = getDocumentationSourceProvider(source);
  const availableLocales = await getAvailableLocales(source, provider);
  const actualLocale = locale === defaultLocale ? undefined : locale && locale in availableLocales ? locale : undefined;

  // Do not cache local trees
  if (source.type === 'local') {
    return resolveDocsTree(source, actualLocale);
  }

  const cache = unstable_cache(
    async (src: DocumentationSource, lang?: string) => resolveDocsTree(src, lang),
    ['source', source.id],
    {
      tags: [cacheUtil.getModDocsTreeCacheId(source.id)]
    }
  );
  return await cache(source, actualLocale);
}

async function resolveDocsTree(source: DocumentationSource, locale?: string): Promise<FileTreeNode[]> {
  const provider = getDocumentationSourceProvider(source);
  const converted = await provider.readFileTree(source);

  const filtered = converted.filter(c =>
    c.type === 'file' && c.name !== DOCS_METADATA_FILE_NAME && c.name !== `${HOMEPAGE_FILE_PATH}.mdx` && (c.name === FOLDER_METADATA_FILE_NAME || c.name.endsWith('.mdx'))
    || c.type === 'directory' && !c.name.startsWith('.') && !c.name.startsWith('(') && c.children && c.children.length > 0);
  return processFileTree(source, '', filtered, locale);
}

async function readShallowFileTree(source: DocumentationSource, path: string): Promise<FileTreeNode[]> {
  const provider = getDocumentationSourceProvider(source);
  return await provider.readShallowFileTree(source, path);
}

async function processFileTree(source: DocumentationSource, root: string, tree: FileTreeNode[], locale?: string): Promise<FileTreeNode[]> {
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
    .map(async (entry) => (
      {
        path: entry.name,
        name: metadata?.[entry.name]?.name || capitalizeDefaultEntryName(entry.name),
        type: entry.type,
        children: entry.children ? await processFileTree(source, (root.length === 0 ? '' : root + '/') + entry.name, entry.children, locale) : [],
        icon: metadata?.[entry.name]?.icon
      }
    )));
}

async function getProjectSourceOrRedirect(slug: string, locale: string, version: string): Promise<DocumentationSource> {
  try {
    const source = await getProjectSource(slug);

    if (version != DEFAULT_DOCS_VERSION) {
      if (source.type !== 'github' || (source as any).branches == undefined || !(version in (source as any).branches)) {
        return redirect(`/mod/${slug}/docs`);
      }
      return {...source, branch: (source as RemoteDocumentationSource).branches![version]} as RemoteDocumentationSource;
    }

    return source;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && e instanceof ValidationError) {
      throw e;
    }
    console.error(e);
    redirect(`/${locale}`, RedirectType.replace);
  }
}

async function getProjectSource(slug: string): Promise<DocumentationSource> {
  if (localPreview.isEnabled()) {
    return findProjectSource(slug, enableLocalSources());
  }

  const cache = unstable_cache(
    async (id: string, enableLocal: boolean) => findProjectSource(id, enableLocal),
    [process.env.LOCAL_DOCS_ROOTS || 'no_locals'],
    {
      tags: [cacheUtil.getModDocsSourceCacheId(slug)]
    }
  );
  return await cache(slug, enableLocalSources());
}

async function getBranchedProjectSource(slug: string, version: string): Promise<DocumentationSource> {
  const source = await getProjectSource(slug);
  return source.type === 'github' && version != DEFAULT_DOCS_VERSION ? {
    ...source,
    branch: (source as RemoteDocumentationSource).branches![version]
  } as RemoteDocumentationSource : source;
}

async function findProjectSource(slug: string, enableLocal: boolean): Promise<DocumentationSource> {
  if (enableLocal) {
    const localSources = await getLocalDocumentationSources();

    const local = localSources.find(s => s.id === slug);
    if (local) {
      return local;
    }
  }

  // Disable remote sources in preview
  if (!localPreview.isEnabled()) {
    const project = await database.getProjectCached(slug);
    if (project) {
      const editable = await githubFacade.isRepositoryPublic(project.source_repo);
      const metadata = await getRemoteRepositoryCachedMetadata(project.id, project.source_repo, project.source_branch, project.source_path);

      return {
        id: project.id,
        platform: project.platform as ModPlatform,
        slug: project.slug,
        type: 'github',
        repo: project.source_repo,
        branch: project.source_branch,
        path: project.source_path,
        is_community: project.is_community,
        editable,
        branches: metadata?.versions
      } as RemoteDocumentationSource;
    }
  }

  throw Error(`Project source not found for ${slug}`);
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
      platform: data.platform,
      slug: data.slug,
      type: 'local',
      path: root,
      is_community: false
    } satisfies LocalDocumentationSource;
  }));
}

async function getAvailableLocales(source: DocumentationSource, provider: DocumentationSourceProvider<any>): Promise<string[]> {
  const cacheId = cacheUtil.getModDocsLocalesCacheId(source.id);

  const cache = unstable_cache(
    async () => computeAvailableLocales(source, provider),
    [cacheId],
    {
      tags: [cacheId]
    }
  );
  return await cache();
}

async function computeAvailableLocales(source: DocumentationSource, provider: DocumentationSourceProvider<any>): Promise<string[]> {
  const localeDirRegex = /^[a-z]{2}_[a-z]{2}$/;
  try {
    const translations = await provider.readShallowFileTree(source, '.translated');
    return translations.filter(t => t.type === 'directory' && t.name.match(localeDirRegex)).map(t => t.name.split('_')[0]);
  } catch (e) {
    return [];
  }
}

function enableLocalSources() {
  return process.env.LOCAL_DOCS_ROOTS !== undefined;
}

async function getRemoteRepositoryCachedMetadata(id: string, repo: string, branch: string, root: string) {
  const cacheId = cacheUtil.getRemoteProjectMetadataCacheId(id);

  const cache = unstable_cache(
    async (r, b, rt) => githubDocsSource.readMetadata(r, b, rt),
    [cacheId],
    {
      tags: [cacheId]
    }
  );

  return await cache(repo, branch, root);
}

function capitalizeDefaultEntryName(str: string) {
  const words = str.split('.')[0].replaceAll(/[_\-]/g, ' ').split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }
  return words.join(' ');
}

export default {
  getProjectSource,
  readDocsTree,
  readDocsFile,
  readShallowFileTree,
  parseFolderMetadataFile,
  getLocalDocumentationSources,
  getProjectSourceOrRedirect,
  getBranchedProjectSource
};
