import dirTee, {DirectoryTree} from "directory-tree";
import {DocumentationFile, DocumentationSourceProvider, LocalDocumentationSource} from "@/lib/docs/sources";
import {promises as fs} from 'fs';
import url from 'url';
import {FileTree} from "@/lib/service";

async function readFileTree(source: LocalDocumentationSource): Promise<FileTree> {
  const tree = dirTee(`${source.path}`, {attributes: ['type']}).children || [];
  return convertDirectoryTree(tree);
}

function convertDirectoryTree(tree: DirectoryTree[]): FileTree {
  return tree.map(e => ({
    name: e.name,
    path: e.path,
    type: e.type === 'directory' ? 'dir' : 'file',
    children: e.children ? convertDirectoryTree(e.children) : []
  }));
}

async function readFileContents(source: LocalDocumentationSource, path: string): Promise<DocumentationFile> {
  const filePath = `${source.path}/${path}`;
  const content = await fs.readFile(filePath, 'utf8');
  const stat = await fs.stat(filePath);
  return { content, edit_url: null, updated_at: stat.mtime }
}

async function readShallowFileTree(source: LocalDocumentationSource, path: string): Promise<FileTree> {
  const tree = dirTee(`${source.path}/${path}`, {attributes: ['type'], depth: 1});
  return (tree?.children || []).map(f => ({
    name: f.name,
    path: f.path,
    type: f.type === 'directory' ? 'dir' : 'file',
    children: [],
    url: url.pathToFileURL(source.path).toString()
  }));
}

export const localDocsSource: DocumentationSourceProvider<LocalDocumentationSource> = {
  readFileTree,
  readFileContents,
  readShallowFileTree
}