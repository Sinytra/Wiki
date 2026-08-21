'use client';

import { ComponentPropsWithoutRef, HTMLAttributes, ReactNode, useState } from 'react';
import { BoxIcon } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  wrapper?: HTMLAttributes<HTMLDivElement>;
  src: string | undefined | null;
  alt?: string;
  strokeWidth?: number;
  fallback?: ReactNode;
  fbIcon?: any;
  fbWidth?: number;
  fbHeight?: number;
  fixedSize?: boolean;
};

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fbWidth,
  fbHeight,
  className,
  title,
  strokeWidth = 1,
  fixedSize,
  wrapper,
  fbIcon: FallbackIcon = BoxIcon,
  fallback: Fallback = (
    <FallbackIcon
      strokeWidth={strokeWidth}
      className={cn(className, 'text-secondary opacity-20')}
      width={fbWidth || width || 32}
      height={fbHeight || height || 32}
    />
  ),
  ...rest
}: Props) {
  const [error, setError] = useState(false);

  return (
    <span
      title={title}
      style={fixedSize ? { width: `${width}px`, height: `${height}px` } : undefined}
      {...wrapper}
      className={cn('shrink-0 overflow-hidden', wrapper?.className)}
    >
      {src && !error && (
        <img
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          className={className}
          onError={() => setError(true)}
          {...rest}
        />
      )}
      {(!src || error) && Fallback}
    </span>
  );
}
