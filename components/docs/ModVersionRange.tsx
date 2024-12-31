import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslations} from "next-intl";

export default function ModVersionRange({versions}: { versions: string[] }) {
  const t = useTranslations('ModVersionRange');

  return (
    <>
      <span className="text-sm sm:text-base">{versions[versions.length - 1]}</span>
      {versions.length > 1 &&
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="text-sm sm:text-base">
                  ({t('desc', {count: versions.length - 1})})
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