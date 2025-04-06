import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tag} from "lucide-react";
import DocsVersionSelectWrapper from "@/components/docs/versions/DocsVersionSelectWrapper";
import {useTranslations} from "next-intl";
import {ProjectVersions} from "@/lib/service";

export default function DocsVersionSelector({version, versions}: { version: string; versions: ProjectVersions }) {
  const t = useTranslations('DocsVersionSelector');

  return (
    <DocsVersionSelectWrapper value={version} defaultValue={DEFAULT_DOCS_VERSION}>
      <SelectTrigger className="sm:w-fit sm:min-w-24 sm:max-w-32 h-8 sm:h-7 py-0 rounded-sm [&>span]:text-sm
                                bg-transparent hover:bg-secondary border-none w-full [&>span]:mr-auto [&>span]:sm:mr-0
                                justify-start [&>svg:last-child]:hidden [&>span]:text-ellipsis [&>span]:block
                                whitespace-nowrap">
        <Tag className="size-3.5 mr-auto sm:mr-2.5 shrink-0"/>
        <SelectValue placeholder={t('placeholder')}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={DEFAULT_DOCS_VERSION} className="[&>span]:text-sm py-1">
          {t('latest')}
        </SelectItem>
        {versions.map((key) => (
          <SelectItem key={key} value={key} className="[&>span]:text-sm py-1">
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </DocsVersionSelectWrapper>
  )
}