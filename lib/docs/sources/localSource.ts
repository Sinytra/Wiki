import dirTee, {DirectoryTree} from "directory-tree";
import {DocumentationSourceProvider, FileTreeNode, LocalDocumentationSource} from "@/lib/docs/sources";
import {promises as fs} from 'fs';

async function readLocalDirectoryTree(source: LocalDocumentationSource): Promise<FileTreeNode[]> {
  const tree = dirTee(`${process.cwd()}/${source.path}`, {attributes: ['type']});
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

async function readFileContents(source: LocalDocumentationSource, path: string): Promise<string> {
  const filePath = `${process.cwd()}/${source.path}/${path}`;
  return fs.readFile(filePath, 'utf8');
}

export const localDocsSource: DocumentationSourceProvider<LocalDocumentationSource> = {
  readFileTree: readLocalDirectoryTree,
  readFileContents
}