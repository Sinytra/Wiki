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
      <SelectTrigger className={`
        h-8 w-full justify-start rounded-sm border-none bg-transparent py-0 whitespace-nowrap hover:bg-secondary sm:h-7
        sm:w-fit sm:max-w-32 sm:min-w-24 [&>span]:mr-auto [&>span]:block [&>span]:text-sm [&>span]:text-ellipsis
        [&>span]:sm:mr-0 [&>svg:last-child]:hidden
      `}>
        <Tag className="mr-auto size-3.5 shrink-0 sm:mr-2.5"/>
        <SelectValue placeholder={t('placeholder')}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={DEFAULT_DOCS_VERSION} className="py-1 [&>span]:text-sm">
          {t('latest')}
        </SelectItem>
        {versions.map((key) => (
          <SelectItem key={key} value={key} className="py-1 [&>span]:text-sm">
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </DocsVersionSelectWrapper>
  )
}