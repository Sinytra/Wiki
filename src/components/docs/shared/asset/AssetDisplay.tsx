'use client'

import {AssetLocation} from "@repo/shared/assets";
import {ImgHTMLAttributes} from "react";
import resourceLocation from "@repo/shared/resourceLocation";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation; noTitle?: boolean };

export default function AssetDisplay({asset, width, height, alt, title, noTitle, ...props}: Props) {
  return (
    <img width={width || 32} height={height || 32}
         src={asset.src} alt={alt || asset.id}
         title={noTitle ? undefined : title || resourceLocation.parse(asset.id)?.path}
         {...props}
    />
  )
}