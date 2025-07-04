'use client'

import {AssetLocation} from "@repo/shared/assets";
import {ImgHTMLAttributes, useEffect, useRef, useState} from "react";
import resourceLocation from "@repo/shared/resourceLocation";
import {cn} from "@repo/ui/lib/utils";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { asset: AssetLocation; noTitle?: boolean };

export default function ItemDisplay({asset, width, height, alt, title, noTitle, ...props}: Props) {
  const imgRef = useRef(null);
  const [src, setSrc] = useState(asset.src);

  useEffect(() => {
    const img = imgRef.current as any;
    if (!img) return;

    const handleError = () => {
      setSrc('/static/missing_item.png');
    };

    img.addEventListener('error', handleError);

    if (img.complete && img.naturalWidth === 0) {
      handleError();
    }

    return () => {
      img.removeEventListener('error', handleError);
    };
  }, [asset.src]);

  return (
    <div {...props} className={cn('overflow-hidden', props.className)}
         style={{width: `${width || 32}px`, height: `${height || 32}px`}}
    >
      <img ref={imgRef}
           width={width || 32} height={height || 32}
           src={src} alt={alt || asset.id}
           title={noTitle ? undefined : title || resourceLocation.parse(asset.id)?.path}
           loading="eager"
      />
    </div>
  )
}