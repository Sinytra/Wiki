'use client'

import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useQueryState} from "nuqs";
import {useTranslations} from "next-intl";

export default function BrowseSortDropdown() {
  const [sort, setSort] = useQueryState('sort', {shallow: false});

  const t = useTranslations('BrowsePage');
  const sortTypes = [
    'relevance',
    'creation_date',
    'popularity',
    'az',
    'za'
  ];

  return (
      <div className="flex flex-row items-center gap-x-4">
        <span className="text-foreground">
          {t('sorting')}
        </span>

        <Select value={sort as string || undefined} defaultValue="relevance" onValueChange={setSort}>
          <SelectTrigger className="w-[180px] border-neutral-600">
            <SelectValue placeholder="Choose one"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {...sortTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {/*@ts-ignore*/}
                    {t(`sort.${type}`)}
                  </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
  );
}