import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

// TODO Mobile support (popover?)
export default function TooltipText({tooltip, className, children}: {tooltip: any; className?: string; children: any}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger className={cn(className, 'underline decoration-1 decoration-neutral-500 decoration-dashed underline-offset-4')}>
          {children}
        </TooltipTrigger>
        <TooltipContent className="px-3 py-1.5 text-sm w-fit max-h-56 max-w-32 overflow-y-auto slim-scrollbar" side="top">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}