'use client'

import {useState} from "react";
import {BoxIcon} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";
import Image from "next/image";

export default function ImageWithFallback({
                                            src,
                                            alt,
                                            width,
                                            height,
                                            fbWidth,
                                            fbHeight,
                                            className,
                                            strokeWidth = 1,
                                            fixedSize,
                                            fallback: FallbackIcon = BoxIcon
                                          }: {
  src?: string,
  width: number,
  height: number,
  strokeWidth?: number,
  className?: string,
  alt?: string,
  fallback?: any,
  fbWidth?: number,
  fbHeight?: number
  fixedSize?: boolean
}) {
  const [error, setError] = useState(false);

  const Fallback = () => <FallbackIcon strokeWidth={strokeWidth}
                                       className={cn(className, 'text-secondary opacity-20')}
                                       width={fbWidth || width}
                                       height={fbHeight || height}/>;

  return (
    <div className="shrink-0" style={fixedSize ? { width: `${width}px`, height: `${height}px` } : undefined}>
      {src && !error &&
        <Image src={src} alt={alt || ''} width={width} height={height} className={className}
               onError={() => setError(true)}
               unoptimized
        />
      }
      {(!src || error) && <Fallback/>}
    </div>
  );
}