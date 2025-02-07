'use client'

import {type ImgHTMLAttributes, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import ItemDisplay from "@/components/docs/shared/util/ItemDisplay";
import {ResolvedItem} from "@/lib/service/types";
import TooltipImg from "@/components/docs/shared/game/TooltipImg";

interface AdditionalProps {
  src: ResolvedItem[];
  noTooltip?: boolean;
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & AdditionalProps;

const INTERVAL = 2000;

// TODO pause all animations when recipe is hovered
export default function RotatingItemDisplaySlot({noTooltip, src, ...props}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (src.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % src.length);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [src]);

  const Content = () => (
    <ItemDisplay noTitle asset={src[currentIndex].src} alt={src[currentIndex].id} className={cn(props.className, 'sharpRenderinga')} {...props} />
  );

  return noTooltip ? <Content /> : (
    <TooltipImg id={src[currentIndex].name}>
      <Content />
    </TooltipImg>
  );
}