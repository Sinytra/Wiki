'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {Tag} from "lucide-react";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {ProjectVersions} from "@/lib/service";
import {useTranslations} from "next-intl";
import {useQueryState} from "nuqs";
import {parseAsString} from "nuqs/server";

export default function DevDocsVersionSelect({versions}: { versions: ProjectVersions; }) {
  const t = useTranslations('DocsVersionSelector');

  const [version, setVersion] = useQueryState('version', parseAsString.withDefault(DEFAULT_DOCS_VERSION).withOptions({shallow: false}));

  const changeVersion = async (id: any) => {
    await setVersion(id);
  };

  return (
    <Select value={version} onValueChange={changeVersion}>
      <SelectTrigger className={cn(
        'rounded-sm bg-primary-dim py-0 hover:bg-secondary sm:w-fit [&>span]:text-sm',
        'whitespace-nowrap [&>span]:block [&>span]:text-ellipsis',
        'h-9 justify-between sm:max-w-40 sm:min-w-32')}
      >
        <Tag className="mr-2.5 size-3.5 shrink-0"/>
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
    </Select>
  )
}