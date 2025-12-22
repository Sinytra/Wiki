'use client'

import {ComponentProps, HTMLAttributes, ReactNode, useState} from "react";
import {BoxIcon} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";
import Image from "next/image";

type Props = Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  wrapper?: HTMLAttributes<HTMLDivElement>,
  src: string | undefined | null,
  alt?: string,
  strokeWidth?: number,
  fallback?: ReactNode,
  fbIcon?: any,
  fbWidth?: number,
  fbHeight?: number
  fixedSize?: boolean
};

export default function ImageWithFallback(
  {
    src, alt, width, height, fbWidth, fbHeight, className, title,
    strokeWidth = 1, fixedSize, wrapper,
    fbIcon: FallbackIcon = BoxIcon,
    fallback: Fallback = <FallbackIcon strokeWidth={strokeWidth}
                                       className={cn(className, 'text-secondary opacity-20')}
                                       width={fbWidth || width}
                                       height={fbHeight || height}/>,
    ...rest
  }: Props) {
  const [error, setError] = useState(false);

  return (
    <span className="shrink-0 overflow-hidden" title={title}
         style={fixedSize ? {width: `${width}px`, height: `${height}px`} : undefined}
         {...wrapper}>
      {src && !error &&
        <Image src={src} alt={alt || ''} width={width} height={height} className={className} unoptimized
               onError={() => setError(true)}
               {...rest}
        />
      }
      {(!src || error) && Fallback}
    </span>
  );
}