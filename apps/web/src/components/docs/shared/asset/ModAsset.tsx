import Asset from "@/components/docs/shared/asset/Asset";
import {ProjectContext} from "@repo/shared/types/service";

// Deprecated
export default async function ModAsset(ctx: ProjectContext | null, props: any) {
  return BoundModAsset({...props, ctx});
}

async function BoundModAsset(props: any) {
  return (
    <Asset {...props} />
  )
}