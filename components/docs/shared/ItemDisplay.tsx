import {AssetLocation, resourceLocationToString} from "@/lib/docs/assets";
import type {ImgHTMLAttributes} from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation };

export default function ItemDisplay({asset, width, height, alt, title, ...props}: Props) {
  return (
    <img width={width || 32} height={height || 32} src={asset.src} alt={alt || resourceLocationToString(asset.id)} title={title || asset.id.path} {...props}/>
  )
}