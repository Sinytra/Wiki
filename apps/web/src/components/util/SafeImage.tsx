'use client'

import {ReactNode, useState} from "react";
import Image from "next/image";

export default function SafeImage({
                                    src,
                                    alt,
                                    width,
                                    height,
                                    className,
                                    loading,
                                    priority,
                                    fallback
                                  }: {
  loading?: boolean,
  src?: string,
  width: number,
  height: number,
  className?: string,
  alt: string,
  priority?: boolean,
  fallback?: ReactNode
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="shrink-0">
      {src && !error &&
        <Image src={src} alt={alt} width={width} height={height} className={className}
               style={{display: !loading || loaded ? 'block' : 'none'}}
               priority={priority}
               onLoad={() => setLoaded(true)}
               onError={() => setError(true)}
        />
      }
      {(!src || (loading && !loaded) || error) && fallback}
    </div>
  );
}