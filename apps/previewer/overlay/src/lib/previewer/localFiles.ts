import { promises as fs } from 'fs';
import { LocalDocumentationFile, LocalDocumentationSource } from './localDocsPages';

async function readFileContents(source: LocalDocumentationSource, path: string): Promise<LocalDocumentationFile> {
  const filePath = `${source.path}/${path}`;
  const content = await fs.readFile(filePath, 'utf8');
  return { content, edit_url: null };
}

export default {
  readFileContents
};
