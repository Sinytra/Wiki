import {
  DocumentationFile,
  DocumentationSourceProvider,
  FileTreeNode,
  RemoteDocumentationSource
} from "@/lib/docs/sources";
import githubApp from "@/lib/github/githubApp";

type FileProcessor = (f: any) => Record<string, any>;

async function readFileTree(source: RemoteDocumentationSource): Promise<FileTreeNode[]> {
  return readGitHubDirectoryTree(source);
}

// TODO Cache
async function readGitHubDirectoryTree(source: RemoteDocumentationSource, path?: string, shallow?: boolean, processor?: FileProcessor): Promise<FileTreeNode[]> {
  const repoParts = source.repo.split('/');
  const installationId = await githubApp.getExistingInstallation(repoParts[0], repoParts[1]);
  const octokit = await githubApp.createInstance(installationId);

  const contentPath = path ? `${source.path}/${path}` : source.path;
  const content = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, contentPath);
  if (content === null || !Array.isArray(content)) {
    return [];
  }

  const root = contentPath.startsWith('/') ? contentPath.substring(1) : contentPath;
  const recursiveResolver = shallow ? async () => [] : async (path: string) => {
    const c = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, path);
    return Array.isArray(c) ? c : [];
  };
  return convertRepositoryContents(root, content, recursiveResolver, processor);
}

async function readFileContents(source: RemoteDocumentationSource, path: string): Promise<DocumentationFile> {
  const repoParts = source.repo.split('/');
  const installationId = await githubApp.getExistingInstallation(repoParts[0], repoParts[1]);
  const octokit = await githubApp.createInstance(installationId);
  const filePath = source.path + (path ? '/' + path : '');

  const file = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, filePath);
  if (file && 'content' in file) {
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    const updated_at = await githubApp.getFileModifiedDate(octokit, repoParts[0], repoParts[1], source.branch, filePath);
    return {content, edit_url: file.html_url, updated_at};
  }
  throw new Error(`Invalid file at path ${path}`);
}

async function convertRepositoryContents(root: string, files: any[], contentGetter: (path: string) => Promise<any[]>, processor?: FileProcessor): Promise<FileTreeNode[]> {
  return Promise.all(files.filter(f => f.type === 'dir' || f.type === 'file').map(async f => ({
    name: f.name,
    path: f.path.substring(root.length),
    type: f.type === 'dir' ? 'directory' : 'file',
    children: await convertRepositoryContents(root, await contentGetter(f.path), contentGetter, processor),
    ...(processor ? processor(f) : {})
  })));
}

async function readShallowFileTree(source: RemoteDocumentationSource, path: string): Promise<FileTreeNode[]> {
  return await readGitHubDirectoryTree(source, path, true);
}

export const githubDocsSource: DocumentationSourceProvider<RemoteDocumentationSource> = {
  readFileTree,
  readFileContents,
  readShallowFileTree
};