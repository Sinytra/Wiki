import {
  AssetLocation,
  AssetProvider,
  AssetSourceRoot,
  itemAssetBasePath,
  itemAssetExtension,
  ResourceLocation
} from "@/lib/base/assets";
import {RemoteDocumentationSource} from "@/lib/docs/sources";
import githubFacade from "@/lib/facade/githubFacade";

async function resolveAsset(root: AssetSourceRoot<RemoteDocumentationSource>, id: ResourceLocation): Promise<AssetLocation | null> {
  const path = root.source.path + '/' + itemAssetBasePath + '/' + id.namespace + '/' + id.path + (id.path.includes('.') ? '' : itemAssetExtension);
  const content = await githubFacade.getRepositoryContents(root.source.repo, root.source.branch, path);
  if (content === null || Array.isArray(content) || !('content' in content)) {
    return null;
  }
  return { id, src: 'data:image/png;base64,' + content.content };
}

const githubAssets: AssetProvider<RemoteDocumentationSource> = {
  resolveAsset
};

export default githubAssets;