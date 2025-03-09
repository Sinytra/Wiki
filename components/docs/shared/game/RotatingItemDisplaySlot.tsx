'use client'

import {type ImgHTMLAttributes, useEffect, useState} from "react";
import ItemDisplay from "@/components/docs/shared/util/ItemDisplay";
import {ResolvedItem} from "@/lib/service/types";
import TooltipImg from "@/components/docs/shared/game/TooltipImg";
import {getExternalWikiLink, getResolvedItemLink} from "@/lib/game/content";

interface AdditionalProps {
  src: ResolvedItem[];
  count?: number;
  noTooltip?: boolean;
  noLink?: boolean;
  params?: any;
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & AdditionalProps;

const INTERVAL = 2000;

// TODO pause all animations when recipe is hovered
export default function RotatingItemDisplaySlot({noTooltip, noLink, src, count, params, ...props}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (src.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % src.length);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [src]);

  const Content = () => {
    const link = params ? getResolvedItemLink(params, src[currentIndex]) : getExternalWikiLink(src[currentIndex].id);
    const element = (
      <div {...props}>
        <div className="relative">
          <ItemDisplay noTitle asset={src[currentIndex].src} alt={src[currentIndex].id} className="sharpRendering"/>
          {count && count > 1 &&
            <span
              className="absolute bottom-0 right-0 text-white text-base leading-1 text-left sharpRendering z-10 font-minecraft"
              style={{textShadow: '2px 2px 0 #3F3F3F'}}>
          {count}
        </span>
          }
        </div>
      </div>
    );
    return link && !noLink ? <a href={link} target="_blank">{element}</a> : element;
  };

  return noTooltip ? <Content/> : (
    <TooltipImg id={src[currentIndex].name}>
      <Content/>
    </TooltipImg>
  );
}