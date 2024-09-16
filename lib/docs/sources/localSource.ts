import dirTee, {DirectoryTree} from "directory-tree";
import {
  DocumentationFile,
  DocumentationSourceProvider,
  FileTreeNode,
  LocalDocumentationSource
} from "@/lib/docs/sources";
import {promises as fs} from 'fs';
import url from 'url';

async function readFileTree(source: LocalDocumentationSource): Promise<FileTreeNode[]> {
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

async function readShallowFileTree(source: LocalDocumentationSource, path: string): Promise<FileTreeNode[]> {
  const tree = dirTee(`${source.path}/${path}`, {attributes: ['type'], depth: 1});
  return (tree?.children || []).map(f => ({
    name: f.name,
    path: f.path,
    type: f.type,
    children: [],
    url: url.pathToFileURL(source.path).toString()
  }));
}

export const localDocsSource: DocumentationSourceProvider<LocalDocumentationSource> = {
  readFileTree,
  readFileContents,
  readShallowFileTree
}