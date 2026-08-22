'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';

export default function TooltipText({ hint, children }: { hint: any; children: any }) {
  return (
    <span className="inline-block">
      <span className="sm:hidden">
        <Popover>
          <PopoverTrigger className={cn(`underline decoration-dotted decoration-2 underline-offset-2`)}>
            {children}
          </PopoverTrigger>
          <PopoverContent
            side="top"
            className={cn(
              'slim-scrollbar max-h-56 max-w-[min(32rem,var(--radix-popper-available-width))]',
              'animate-none! overflow-y-auto px-3 py-1.5 text-sm break-words whitespace-normal'
            )}
          >
            {hint}
          </PopoverContent>
        </Popover>
      </span>
      <span className="hidden sm:block">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger
              className={cn(`cursor-help underline decoration-dotted decoration-2 underline-offset-2 select-text`)}
            >
              {children}
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className={cn(
                'slim-scrollbar max-h-56 max-w-[min(32rem,var(--radix-popper-available-width))] animate-none!',
                'overflow-y-auto px-3 py-1.5 text-sm break-words whitespace-normal'
              )}
            >
              {hint}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </span>
  );
}
