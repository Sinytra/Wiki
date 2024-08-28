import {AssetLocation, resourceLocationToString} from "@/lib/docs/assets";

export default function ItemDisplay({asset}: { asset: AssetLocation }) {
  return (
    <img width={32} height={32} src={asset.src} alt={resourceLocationToString(asset.id)} title={asset.id.path}/>
  )
}