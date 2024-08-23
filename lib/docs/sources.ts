import {promises as fs} from 'fs';
import database from "@/lib/database";
import dirTee, {DirectoryTree} from "directory-tree";
import {ModPlatform} from "@/lib/platforms";
import {unstable_cache} from "next/cache";

const metadataFile = 'sinytra-wiki.json';
export const folderMetaFile = '_meta.json';

type SourceType = 'local' | 'github';

interface DocumentationSource {
  id: string;
  platform: ModPlatform;
  slug: string;
  type: SourceType;
}

interface LocalDocumentationSource extends DocumentationSource {
  path: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  children: FileTreeNode[]
}

async function readDocsFile(source: DocumentationSource, path: string[]) {
  if (!('path' in source)) {
    throw Error('Remote paths are not yet implemented');
  }

  const filePath = `${process.cwd()}/${source.path}/${path.join('/')}.mdx`;
  return await fs.readFile(filePath, 'utf8');
}

async function readMetadataFile(source: DocumentationSource, path: string): Promise<Record<string, string>> {
  if (!('path' in source)) {
    throw Error('Remote paths are not yet implemented');
  }

  const filePath = `${process.cwd()}/${source.path}/${path}`;
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

// TODO MUST BE CACHED NO MATTER WHAT (use file watcher?)
async function readDocsTree(source: DocumentationSource): Promise<FileTreeNode[]> {
  if (!('path' in source)) {
    throw Error('Remote paths are not yet implemented');
  }

  const root = source.path;

  const tree = dirTee(`${process.cwd()}/${root}`, {attributes: ['type']});
  const filtered = (tree.children || [])
    .filter(c =>
      c.type === 'file' && c.name !== 'sinytra-wiki.json' && (c.name === folderMetaFile || c.name.endsWith('.mdx'))
      || c.type === 'directory' && !c.name.startsWith('.') && !c.name.startsWith('(') && c.children && c.children.length > 0);
  return processFileTree(source, '', filtered);
}

async function processFileTree(source: DocumentationSource, root: string, tree: DirectoryTree[]): Promise<FileTreeNode[]> {
  const metaFile = tree.find(t => t.type === 'file' && t.name === folderMetaFile);
  const metadata = metaFile ? await readMetadataFile(source, (root.length === 0 ? '' : root + '/') + metaFile.name) : undefined;
  const order = Object.keys(metadata || {});
  return Promise.all(tree
    .filter(f => f.type !== 'file' || f.name !== folderMetaFile)
    .sort((a, b) => {
      if (!metadata) {
        // Show folders followed by files
        return a.type.localeCompare(b.type); 
      }
      else if (!order.includes(a.name) || !order.includes(b.name)) {
        return 0;
      }
      return order.indexOf(a.name) - order.indexOf(b.name);
    })
    .map(async (entry) => (
      {
        path: entry.name,
        name: metadata && metadata[entry.name] || entry.name,
        type: entry.type,
        children: entry.children ? await processFileTree(source, (root.length === 0 ? '' : root + '/') + entry.name, entry.children) : []
      }
    )));
}

async function getProjectSource(slug: string): Promise<DocumentationSource> {
  const cache = unstable_cache(
    async () => findProjectSource(slug),
    [slug],
    {
      tags: ['mod:' + slug]
    }
  );
  return await cache();
}

async function findProjectSource(slug: string): Promise<DocumentationSource> {
  if (enableLocalSources()) {
    const localSources = await getLocalDocumentationSources();

    const local = localSources.find(s => s.id === slug);
    if (local) {
      return local;
    }
  }

  const project = await database.getProject(slug);
  if (project) {
    return {id: project.id, platform: project.platform as ModPlatform, slug: project.slug, type: 'github'};
  }

  throw Error(`Project source not found for ${slug}`);
}

async function getLocalDocumentationSources(): Promise<DocumentationSource[]> {
  if (!enableLocalSources()) {
    return [];
  }

  const roots = process.env.LOCAL_DOCS_ROOTS!.split(';');

  return Promise.all(roots.map(async (root) => {
    const file = await fs.readFile(`${process.cwd()}/${root}/${metadataFile}`, 'utf8');
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

async function isLocalSource(slug: string): Promise<boolean> {
  const source = await getProjectSource(slug);
  return source.type === 'local';
}

const sources = {
  getLocalDocumentationSources,
  getProjectSource,
  readDocsTree,
  isLocalSource,
  readDocsFile,
  readMetadataFile
};

export default sources;
