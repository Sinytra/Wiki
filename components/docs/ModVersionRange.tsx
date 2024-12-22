import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function ModVersionRange({versions}: { versions: string[] }) {
  return (
    <>
      {versions[versions.length - 1]}
      {versions.length > 1 &&
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    (+{versions.length - 1} more)
                </TooltipTrigger>
                <TooltipContent className="max-h-56 max-w-32 overflow-y-auto slim-scrollbar" side="bottom">
                    <ul>
                      {...versions.reverse().slice(1).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      }
    </>
  )
}