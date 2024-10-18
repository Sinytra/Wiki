import {SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select";
import {GitBranchIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import DocsVersionSelectWrapper from "@/components/docs/versions/DocsVersionSelectWrapper";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";

export default function DocsBranchSelector({branch, branches}: { branch: string; branches?: Record<string, string> }) {
  const t = useTranslations('DocsBranchSelector');

  return (
    <div>
      <DocsVersionSelectWrapper value={branch} defaultValue={DEFAULT_DOCS_VERSION}>
        <SelectTrigger className="w-36 h-9 [&>span]:text-ellipsis [&>span]:max-w-16 [&>span]:block">
          <GitBranchIcon className="w-4 h-4"/>
          <SelectValue placeholder="Latest"/>
        </SelectTrigger>
        <SelectContent className="text-ellipsis overflow-hidden w-36 whitespace-nowrap">
          <SelectGroup>
            <SelectLabel>
              {t('title')}
            </SelectLabel>

            <SelectItem value={DEFAULT_DOCS_VERSION}>
              {t('latest')}
            </SelectItem>
            {branches && Object.entries(branches).map(e => (
              <SelectItem key={e[0]} value={e[0]}
                          className="[&>span:last-child]:text-ellipsis [&>span:last-child]:overflow-hidden">
                {e[0]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </DocsVersionSelectWrapper>
    </div>
  )
}