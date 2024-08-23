import {DocumentationSourceProvider, FileTreeNode, RemoteDocumentationSource} from "@/lib/docs/sources";
import githubApp, {RepositoryContent} from "@/lib/github/githubApp";

async function readGitHubDirectoryTree(source: RemoteDocumentationSource): Promise<FileTreeNode[]> {
  const repoParts = source.repo.split('/');
  const installationId = await githubApp.getExistingInstallation(repoParts[0], repoParts[1]);
  const octokit = await githubApp.createInstance(installationId);

  const content = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, source.path);
  if (content === null || !Array.isArray(content)) {
    return [];
  }

  const root = source.path.startsWith('/') ? source.path.substring(1) : source.path;
  return convertRepositoryContents(root, content, async (path) => {
    const c = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, path);
    return Array.isArray(c) ? c : [];
  });
}

async function readFileContents(source: RemoteDocumentationSource, path: string): Promise<string> {
  const file = await readRepositoryContents(source as RemoteDocumentationSource, path);
  if (file && 'content' in file) {
    return Buffer.from(file.content, 'base64').toString('utf-8');
  }
  throw new Error(`Invalid file at path ${path}`);
}

async function readRepositoryContents(source: RemoteDocumentationSource, path?: string): Promise<RepositoryContent | null> {
  const repoParts = source.repo.split('/');
  const installationId = await githubApp.getExistingInstallation(repoParts[0], repoParts[1]);
  const octokit = await githubApp.createInstance(installationId);

  return await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], source.branch, source.path + (path ? '/' + path : ''));
}

async function convertRepositoryContents(root: string, files: any[], contentGetter: (path: string) => Promise<any[]>): Promise<FileTreeNode[]> {
  return Promise.all(files.filter(f => f.type === 'dir' || f.type === 'file').map(async f => ({
    name: f.name,
    path: f.path.substring(root.length),
    type: f.type === 'dir' ? 'directory' : 'file',
    children: await convertRepositoryContents(root, await contentGetter(f.path), contentGetter)
  })));
}

export const githubDocsSource: DocumentationSourceProvider<RemoteDocumentationSource> = {
  readFileTree: readGitHubDirectoryTree,
  readFileContents
};