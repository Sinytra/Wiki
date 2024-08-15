import {promises as fs} from 'fs';
import database from "@/lib/database";
import {Dirent} from "node:fs";

const metadataFile = 'sinytra-wiki.json';

type SourceType = 'local' | 'github';

interface DocumentationSource {
  id: string;
  type: SourceType;
}

interface LocalDocumentationSource extends DocumentationSource {
  path: string;
}

async function readDocsTree(root: string): Promise<Dirent[]> {
  return fs.readdir(`${process.cwd()}/${root}`, { withFileTypes: true });
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
    return {id: project.id, type: 'github'};
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

    return {id: data.id, type: 'local', path: root} satisfies LocalDocumentationSource;
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
  isLocalSource
};

export default sources;
