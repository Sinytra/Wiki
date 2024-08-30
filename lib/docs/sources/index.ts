import {promises as fs} from 'fs';
import database from "@/lib/database";
import {ModPlatform} from "@/lib/platforms";
import {unstable_cache} from "next/cache";
import {localDocsSource} from "@/lib/docs/sources/localSource";
import {githubDocsSource} from "@/lib/docs/sources/githubSource";
import cacheUtil from "@/lib/cacheUtil";
import githubApp from "@/lib/github/githubApp";
import localPreview from "@/lib/docs/localPreview";

const metadataFile = 'sinytra-wiki.json';
export const folderMetaFile = '_meta.json';

type SourceType = 'local' | 'github';

export interface DocumentationSource {
  id: string;
  platform: ModPlatform;
  slug: string;

  path: string;
  type: SourceType;
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
}

export interface FileTreeNode {
  name: string;
  path: string;
  url?: string;
  type: 'directory' | 'file';
  children: FileTreeNode[]
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

async function readMetadataFile(source: DocumentationSource, path: string, locale?: string): Promise<Record<string, string>> {
  const provider = getDocumentationSourceProvider(source);

  try {
    const file = await readLocalizedFile(provider, source, path, locale);
    return JSON.parse(file.content);
  } catch (e) {
    return {};
  }
}

async function readLocalizedFile(provider: DocumentationSourceProvider<any>, source: DocumentationSource, path: string, locale?: string): Promise<DocumentationFile> {
  if (locale) {
    const localeFolder = `.translated/${locale}_${locale}/`;
    try {
      return await provider.readFileContents(source, localeFolder + path);
    } catch (e) {
      // fallback to default locale
    }
  }
  return await provider.readFileContents(source, path);
}

async function readDocsTree(source: DocumentationSource, locale?: string): Promise<FileTreeNode[]> {
  // Do not cache local trees
  if (source.type === 'local') {
    return resolveDocsTree(source, locale);
  }

  const cache = unstable_cache(
    async (locale?: string) => resolveDocsTree(source, locale),
    ['source', source.id],
    {
      tags: [cacheUtil.getModDocsTreeCacheId(source.id)]
    }
  );
  return await cache(locale);
}

async function resolveDocsTree(source: DocumentationSource, locale?: string): Promise<FileTreeNode[]> {
  const provider = getDocumentationSourceProvider(source);
  const converted = await provider.readFileTree(source);

  const filtered = converted.filter(c =>
    c.type === 'file' && c.name !== metadataFile && (c.name === folderMetaFile || c.name.endsWith('.mdx'))
    || c.type === 'directory' && !c.name.startsWith('.') && !c.name.startsWith('(') && c.children && c.children.length > 0);
  return processFileTree(source, '', filtered, locale);
}

async function readShallowFileTree(source: DocumentationSource, path: string): Promise<FileTreeNode[]> {
  const provider = getDocumentationSourceProvider(source);
  return await provider.readShallowFileTree(source, path);
}

async function processFileTree(source: DocumentationSource, root: string, tree: FileTreeNode[], locale?: string): Promise<FileTreeNode[]> {
  const metaFile = tree.find(t => t.type === 'file' && t.name === folderMetaFile);
  const metadata = metaFile ? await readMetadataFile(source, (root.length === 0 ? '' : root + '/') + metaFile.name, locale) : undefined;
  const order = Object.keys(metadata || {});
  return Promise.all(tree
    .filter(f => f.type !== 'file' || f.name !== folderMetaFile)
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
        name: metadata && metadata[entry.name] || entry.name,
        type: entry.type,
        children: entry.children ? await processFileTree(source, (root.length === 0 ? '' : root + '/') + entry.name, entry.children, locale) : []
      }
    )));
}

async function getProjectSource(slug: string): Promise<DocumentationSource> {
  const cache = unstable_cache(
    async (id: string, enableLocal: boolean) => findProjectSource(id, enableLocal),
    [],
    {
      tags: [cacheUtil.getModDocsSourceCacheId(slug)]
    }
  );
  return await cache(slug, enableLocalSources());
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
    const project = await database.getProject(slug);
    if (project) {
      const editable = await githubApp.isRepositoryPublic(project.source_repo);

      return {
        id: project.id,
        platform: project.platform as ModPlatform,
        slug: project.slug,
        type: 'github',
        repo: project.source_repo,
        branch: project.source_branch,
        path: project.source_path,
        editable
      } as RemoteDocumentationSource;
    }
  }

  throw Error(`Project source not found for ${slug}`);
}

async function getLocalDocumentationSources(): Promise<DocumentationSource[]> {
  const cache = unstable_cache(
    async (paths: string) => computeLocalDocumentationSources(paths),
    [],
    {
      tags: ['local_sources']
    }
  );
  return await cache(process.env.LOCAL_DOCS_ROOTS || '');
}

async function computeLocalDocumentationSources(paths: string): Promise<DocumentationSource[]> {
  const roots = paths!.split(';');

  return Promise.all(roots.map(async (root) => {
    const file = await fs.readFile(`${root}/${metadataFile}`, 'utf8');
    const data = JSON.parse(file);

    return {
      id: data.id,
      platform: data.platform,
      slug: data.slug,
      type: 'local',
      path: root
    } satisfies LocalDocumentationSource;
  }));
}

function enableLocalSources() {
  return process.env.LOCAL_DOCS_ROOTS !== undefined;
}

const index = {
  getProjectSource,
  readDocsTree,
  readDocsFile,
  readShallowFileTree,
  readMetadataFile,
  getLocalDocumentationSources
};

export default index;
