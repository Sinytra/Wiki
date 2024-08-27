import dirTee, {DirectoryTree} from "directory-tree";
import {
  DocumentationFile,
  DocumentationSourceProvider,
  FileTreeNode,
  LocalDocumentationSource
} from "@/lib/docs/sources";
import {promises as fs} from 'fs';

async function readLocalDirectoryTree(source: LocalDocumentationSource): Promise<FileTreeNode[]> {
  const tree = dirTee(`${source.path}`, {attributes: ['type']});
  return convertDirectoryTree(tree.children || []);
}

function convertDirectoryTree(tree: DirectoryTree[]): FileTreeNode[] {
  return tree.map(e => ({
    name: e.name,
    path: e.path,
    type: e.type,
    children: e.children ? convertDirectoryTree(e.children) : []
  }));
}

async function readFileContents(source: LocalDocumentationSource, path: string): Promise<DocumentationFile> {
  const filePath = `${source.path}/${path}`;
  const content = await fs.readFile(filePath, 'utf8');
  const stat = await fs.stat(filePath);
  return { content, edit_url: null, updated_at: stat.mtime }
}

export const localDocsSource: DocumentationSourceProvider<LocalDocumentationSource> = {
  readFileTree: readLocalDirectoryTree,
  readFileContents
}