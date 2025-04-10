import {useTranslations} from "next-intl";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export default function ModVersionRange({versions}: { versions: string[] }) {
  const t = useTranslations('ModVersionRange');

  return (
    <>
      <span className="text-sm">{versions[versions.length - 1]}</span>
      {versions.length > 1 &&
        <Popover>
            <PopoverTrigger className="text-sm">
                ({t('desc', {count: versions.length - 1})})
            </PopoverTrigger>
            <PopoverContent className="px-3 py-1.5 text-sm w-fit max-h-56 max-w-32 overflow-y-auto slim-scrollbar" side="bottom">
                <ul>
                  {...versions.reverse().slice(1).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
            </PopoverContent>
        </Popover>
      }
    </>
  )
}