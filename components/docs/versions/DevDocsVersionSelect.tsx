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
        'sm:w-fit py-0 rounded-sm [&>span]:text-sm bg-primary-dim hover:bg-secondary',
        '[&>span]:text-ellipsis [&>span]:block whitespace-nowrap',
        'justify-between h-9 sm:min-w-32 sm:max-w-40')}
      >
        <Tag className="size-3.5 mr-2.5 shrink-0"/>
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
    </Select>
  )
}