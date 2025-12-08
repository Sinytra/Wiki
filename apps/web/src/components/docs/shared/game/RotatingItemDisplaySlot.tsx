'use client'

import {type ImgHTMLAttributes, useContext, useEffect, useMemo, useState} from "react";
import TooltipImg from "@/components/docs/shared/game/TooltipImg";
import {getExternalWikiLink, getResolvedItemLink} from "@/lib/project/game/content";
import {HoverContext} from "@/components/util/HoverContextProvider";
import {DisplayItem, ProjectContext} from "@repo/shared/types/service";
import ItemAssetDisplay from "@/components/docs/shared/asset/ItemAssetDisplay";
import {NavLink} from "@/components/navigation/link/NavLink";

interface AdditionalProps {
  src: DisplayItem[];
  count?: number;
  noTooltip?: boolean;
  noLink?: boolean;
  ctx?: ProjectContext;
  tag?: string | null;
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & AdditionalProps;

const INTERVAL = 2000;

export default function RotatingItemDisplaySlot({noTooltip, noLink, src, count, ctx, tag, ...props}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSrc = useMemo(() => src[currentIndex]!, [currentIndex, src]);
  const hoverCtx = useContext(HoverContext);

  // Preload all images
  useEffect(() => {
    src.forEach((src) => {
      const img = new Image();
      img.src = src.asset.src;
    });
  }, [src]);

  useEffect(() => {
    if (src.length === 0) return;

    const interval = setInterval(() => {
      if (!hoverCtx || !hoverCtx.hover) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % src.length);
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [src, hoverCtx]);

  const Content = () => {
    const link = ctx ? getResolvedItemLink(ctx, currentSrc) : getExternalWikiLink(currentSrc.id);
    const element = (
      <div {...props}>
        <div className="relative shrink-0">
          <ItemAssetDisplay noTitle asset={currentSrc.asset} alt={currentSrc.name ?? currentSrc.id}
                            className="sharpRendering"/>
          {count && count > 1 &&
            <span
              className={`
                sharpRendering absolute right-0 bottom-0 z-10 text-left font-minecraft text-base leading-1 text-white
              `}
              style={{textShadow: '2px 2px 0 #3F3F3F'}}
            >
              {count}
            </span>
          }
        </div>
      </div>
    );
    return link && !noLink ? <NavLink href={link} rel="noreferrer">{element}</NavLink> : element;
  };

  return noTooltip ? <Content/> : (
    <TooltipImg id={currentSrc.name || currentSrc.id} tag={tag}>
      <Content/>
    </TooltipImg>
  );
}