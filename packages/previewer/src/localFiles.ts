import {FileTree} from '@repo/shared/types/service';
import dirTee, {DirectoryTree} from 'directory-tree';
import {promises as fs} from 'fs';
import url from 'url';
import {LocalDocumentationFile, LocalDocumentationSource} from './localDocsPages';

function isFileTypeAllowed(f: DirectoryTree): boolean {
  const ALLOWED_FILE_TYPES = ['.mdx', '.json'];

  return f.type === 'directory' || ALLOWED_FILE_TYPES.some(t => f.name.endsWith(t));
}

async function readFileTree(source: LocalDocumentationSource): Promise<FileTree> {
  const tree = dirTee(`${source.path}`, {attributes: ['type']})?.children || [];
  return convertDirectoryTree(tree);
}

function convertDirectoryTree(tree: DirectoryTree[]): FileTree {
  return tree
    .filter(isFileTypeAllowed)
    .map(e => ({
      name: e.name,
      path: e.path,
      type: e.type === 'directory' ? 'dir' : 'file',
      children: e.children ? convertDirectoryTree(e.children) : []
    }));
}

async function readFileContents(source: LocalDocumentationSource, path: string): Promise<LocalDocumentationFile> {
  const filePath = `${source.path}/${path}`;
  const content = await fs.readFile(filePath, 'utf8');
  return {content, edit_url: null};
}

async function readShallowFileTree(source: LocalDocumentationSource, path: string): Promise<FileTree> {
  const tree = dirTee(`${source.path}/${path}`, {attributes: ['type'], depth: 1});
  return (tree?.children || [])
    .filter(isFileTypeAllowed)
    .map(f => ({
      name: f.name,
      path: f.path,
      type: f.type === 'directory' ? 'dir' : 'file',
      children: [],
      url: url.pathToFileURL(source.path).toString()
    }));
}

export default {
  readFileTree,
  readFileContents,
  readShallowFileTree
};