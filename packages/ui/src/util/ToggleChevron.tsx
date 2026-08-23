'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@repo/ui/lib/utils';

interface Props {
  className?: string;
  active?: boolean;
  animate?: boolean;
}

export default function ToggleChevron({ className, active, animate = true }: Props) {
  return (
    <ChevronDownIcon
      className={cn(
        className,
        'shrink-0 data-[rotate=true]:rotate-180',
        animate && 'transition-transform duration-200'
      )}
      data-rotate={active ? 'true' : 'false'}
    />
  );
}
