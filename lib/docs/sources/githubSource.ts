import {DocumentationSourceProvider, FileTreeNode, RemoteDocumentationSource} from "@/lib/docs/sources";
import {DOCS_METADATA_FILE_NAME} from "@/lib/constants";
import metadata, {DocumentationProjectMetadata} from "@/lib/docs/metadata";
import githubFacade from "@/lib/facade/githubFacade";

interface RemoteDocumentationSourceProvider extends DocumentationSourceProvider<RemoteDocumentationSource> {
  readMetadata: (repo: string, branch: string, root: string) => Promise<DocumentationProjectMetadata | null>;
}

async function readFileTree(source: RemoteDocumentationSource): Promise<FileTreeNode[]> {
  return githubFacade.readGitHubDirectoryTree(source);
}

async function readShallowFileTree(source: RemoteDocumentationSource, path: string): Promise<FileTreeNode[]> {
  return githubFacade.readGitHubDirectoryTree(source, path, true);
}

async function readMetadata(repo: string, branch: string, root: string) {
  const metadataPath = root + '/' + DOCS_METADATA_FILE_NAME;
  const metaFile = await githubFacade.getRepositoryContents(repo, branch, metadataPath);

  if (metaFile && 'content' in metaFile) {
    const content = Buffer.from(metaFile.content, 'base64').toString('utf-8');
    return metadata.parseMetadata(content);
  }

  return null;
}

export const githubDocsSource: RemoteDocumentationSourceProvider = {
  readFileTree,
  readFileContents: githubFacade.getRepositoryFileContents,
  readShallowFileTree,
  readMetadata
};