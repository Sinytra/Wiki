'use client'

import {useState} from "react";
import {BoxIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ImageWithFallback({ src, alt, width, height, className, loading, fallback: FallbackIcon = BoxIcon }: { loading?: boolean, src?: string, width: number, height: number, className?: string, alt?: string, fallback?: any }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const Fallback = () => <FallbackIcon strokeWidth={1} className={cn(className, 'text-muted-foreground opacity-20')} width={width} height={height}/>;

  return (
    <div>
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