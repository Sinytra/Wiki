'use client'

import {AssetLocation} from "@repo/shared/assets";
import {ImgHTMLAttributes} from "react";
import resourceLocation from "@repo/shared/resourceLocation";
import ImageWithFallback from "@/components/util/ImageWithFallback";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation; fallback?: boolean; noTitle?: boolean };

function parseNum(num: string | number | undefined) {
  if (typeof num === 'string') {
    const parsed = Number(num);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return num;
}

export default function AssetDisplay({asset, width, height, alt, title, noTitle, ...props}: Props) {
  return (
    <ImageWithFallback width={parseNum(width) || 32} height={parseNum(height) || 32}
         src={asset.src} alt={alt || asset.id}
         title={noTitle ? undefined : title || resourceLocation.parse(asset.id)?.path}
         strokeWidth={1.5}
         wrapper={{className: "inline sharpRendering"}}
         {...props}
    />
  )
}