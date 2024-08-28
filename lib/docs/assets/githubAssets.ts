import {
  AssetLocation,
  AssetProvider,
  AssetSourceRoot,
  itemAssetBasePath,
  itemAssetExtension, ResourceLocation
} from "@/lib/docs/assets/index";
import {RemoteDocumentationSource} from "@/lib/docs/sources";
import githubApp from "@/lib/github/githubApp";

// TODO use static resource for public repos
async function resolveAsset(root: AssetSourceRoot<RemoteDocumentationSource>, id: ResourceLocation): Promise<AssetLocation | null> {
  const path = root.source.path + '/' + itemAssetBasePath + '/' + id.namespace + '/' + id.path + itemAssetExtension;
  const repoParts = root.source.repo.split('/');
  const installationId = await githubApp.getExistingInstallation(repoParts[0], repoParts[1]);
  const octokit = await githubApp.createInstance(installationId);

  const content = await githubApp.getRepoContents(octokit, repoParts[0], repoParts[1], root.source.branch, path);
  if (content === null || Array.isArray(content) || !('content' in content)) {
    return null;
  }
  return { id, src: 'data:image/png;base64,' + content.content };
}

const githubAssets: AssetProvider<RemoteDocumentationSource> = {
  resolveAsset
};

export default githubAssets;