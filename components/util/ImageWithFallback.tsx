'use client'

import {useState} from "react";
import {BoxIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ImageWithFallback({
                                            src,
                                            alt,
                                            width,
                                            height,
                                            fbWidth,
                                            fbHeight,
                                            className,
                                            loading,
                                            strokeWidth = 1,
                                            fallback: FallbackIcon = BoxIcon
                                          }: {
  loading?: boolean,
  src?: string,
  width: number,
  height: number,
  strokeWidth?: number,
  className?: string,
  alt?: string,
  fallback?: any,
  fbWidth?: number,
  fbHeight?: number
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const Fallback = () => <FallbackIcon strokeWidth={strokeWidth}
                                       className={cn(className, 'text-secondary opacity-20')}
                                       width={fbWidth || width}
                                       height={fbHeight || height}/>;

  return (
    <div className="shrink-0">
      {src && !error &&
        <img src={src} alt={alt} width={width} height={height} className={className}
             style={{display: !loading || loaded ? 'block' : 'none'}}
             onLoad={() => setLoaded(true)}
             onError={() => setError(true)}
        />
      }
      {(!src || (loading && !loaded) || error) && <Fallback/>}
    </div>
  );
}