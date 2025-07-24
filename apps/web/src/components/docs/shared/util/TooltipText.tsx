import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/ui/components/tooltip";
import {cn} from "@repo/ui/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/ui/components/popover";

export default function TooltipText({tooltip, children}: {tooltip: any; children: any}) {
  return (
    <div className="inline-block">
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger className={cn(`
            underline decoration-neutral-500 decoration-dashed decoration-1 underline-offset-4
          `)}>
            {children}
          </PopoverTrigger>
          <PopoverContent className="slim-scrollbar max-h-56 w-fit max-w-32 overflow-y-auto px-3 py-1.5 text-sm" side="bottom">
            {tooltip}
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden sm:block">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className={cn(`
              underline decoration-neutral-500 decoration-dashed decoration-1 underline-offset-4
            `)}>
              {children}
            </TooltipTrigger>
            <TooltipContent className="slim-scrollbar max-h-56 w-fit max-w-32 overflow-y-auto px-3 py-1.5 text-sm" side="top">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}