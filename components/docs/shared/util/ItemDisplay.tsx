import {AssetLocation} from "@/lib/assets";
import type {ImgHTMLAttributes} from "react";
import resourceLocation from "@/lib/util/resourceLocation";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation };

export default function ItemDisplay({asset, width, height, alt, title, ...props}: Props) {
  return (
    <img width={width || 32} height={height || 32} src={asset.src} alt={alt || asset.id} title={title || resourceLocation.parse(asset.id)?.path} {...props}/>
  )
}