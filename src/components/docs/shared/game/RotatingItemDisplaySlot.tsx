'use client'

import {type ImgHTMLAttributes, useContext, useEffect, useState} from "react";
import ItemDisplay from "@/components/docs/shared/util/ItemDisplay";
import TooltipImg from "@/components/docs/shared/game/TooltipImg";
import {getExternalWikiLink, getResolvedItemLink} from "@/lib/game/content";
import {HoverContext} from "@/components/util/HoverContextProvider";
import {DisplayItem} from "@repo/shared/types/service";

interface AdditionalProps {
  src: DisplayItem[];
  count?: number;
  noTooltip?: boolean;
  noLink?: boolean;
  params?: any;
  tag?: string | null;
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & AdditionalProps;

const INTERVAL = 2000;

export default function RotatingItemDisplaySlot({noTooltip, noLink, src, count, params, tag, ...props}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    const link = params ? getResolvedItemLink(params, src[currentIndex]) : getExternalWikiLink(src[currentIndex].id);
    const element = (
      <div {...props}>
        <div className="relative shrink-0">
          <ItemDisplay noTitle asset={src[currentIndex].asset} alt={src[currentIndex].name ?? src[currentIndex].id}
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
    return link && !noLink ? <a href={link} target="_blank">{element}</a> : element;
  };

  return noTooltip ? <Content/> : (
    <TooltipImg id={src[currentIndex].name} tag={tag}>
      <Content/>
    </TooltipImg>
  );
}