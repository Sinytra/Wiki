import {AssetLocation} from "@/lib/base/assets";
import type {ImgHTMLAttributes} from "react";
import resourceLocation from "@/lib/base/resourceLocation";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation };

export default function ItemDisplay({asset, width, height, alt, title, ...props}: Props) {
  return (
    <img width={width || 32} height={height || 32} src={asset.src} alt={alt || resourceLocation.toString(asset.id)} title={title || asset.id.path} {...props}/>
  )
}