import {promises as fs} from 'fs';
import database from "@/lib/database";
import dirTee, {DirectoryTree} from "directory-tree";
import {ModPlatform} from "@/lib/platforms";

const metadataFile = 'sinytra-wiki.json';

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

async function readDocsFile(source: DocumentationSource, path: string[]) {
  if (!('path' in source)) {
    throw Error('Remote paths are not yet implemented');
  }

  const filePath = `${process.cwd()}/${source.path}/${path.join('/')}.mdx`;
  return await fs.readFile(filePath, 'utf8');
}

// TODO MUST BE CACHED NO MATTER WHAT (use file watcher?)
async function readDocsTree(source: DocumentationSource): Promise<DirectoryTree> {
  if (!('path' in source)) {
    throw Error('Remote paths are not yet implemented');
  }

  const root = source.path;

  return dirTee(`${process.cwd()}/${root}`, { attributes: ['type'] });
}

async function getProjectSource(slug: string): Promise<DocumentationSource> {
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

    return {id: data.id, platform: data.platform, slug: data.slug, type: 'local', path: root} satisfies LocalDocumentationSource;
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
  readDocsFile
};

export default sources;
