import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export default function TooltipText({tooltip, children}: {tooltip: any; children: any}) {
  return (
    <div className="inline-block">
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger className={cn('underline decoration-1 decoration-neutral-500 decoration-dashed underline-offset-4')}>
            {children}
          </PopoverTrigger>
          <PopoverContent className="px-3 py-1.5 text-sm w-fit max-h-56 max-w-32 overflow-y-auto slim-scrollbar" side="bottom">
            {tooltip}
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden sm:block">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className={cn('underline decoration-1 decoration-neutral-500 decoration-dashed underline-offset-4')}>
              {children}
            </TooltipTrigger>
            <TooltipContent className="px-3 py-1.5 text-sm w-fit max-h-56 max-w-32 overflow-y-auto slim-scrollbar" side="top">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}