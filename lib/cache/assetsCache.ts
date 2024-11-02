import {wrapCached, wrapDynamicCached} from "@/lib/cacheUtil";
import assets, {ResourceLocation} from "@/lib/base/assets";
import {DocumentationSource} from "@/lib/docs/sources";

const getBuiltinAssetSources = wrapCached(
  'builtin_asset_sources',
  assets.getBuiltinAssetSources
);

const getDocumentationAsset = wrapDynamicCached(
  'mod_source_assets',
  (location: ResourceLocation, source?: DocumentationSource) => source?.id || '_global',
  assets.getAssetResource
)

export default {
  getBuiltinAssetSources,
  getDocumentationAsset
}