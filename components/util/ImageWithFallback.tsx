'use client'

import {useState} from "react";
import {BoxIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ImageWithFallback({ src, alt, width, height, className }: { src?: string, width: number, height: number, className: string, alt?: string }) {
  const [error, setError] = useState(false);

  const Fallback = () => <BoxIcon strokeWidth={1} className={cn(className, 'text-muted-foreground opacity-20')} width={width} height={height}/>;

  return (
    <div>
      {src && !error
        ?
        <img src={src} alt={alt} width={width} height={height} className={className} onError={() => setError(true)}/>
        :
        <Fallback/>
      }
    </div>
  );
}