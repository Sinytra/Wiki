'use client'

import {
  BoxIcon,
  BracesIcon, FilterXIcon,
  PackageOpenIcon,
  PaintbrushIcon,
  SearchIcon,
  SwatchBookIcon,
  UnplugIcon
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {parseAsArrayOf, useQueryState} from "nuqs";
import {parseAsString} from "nuqs/server";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

function FilterSearch({filter, setFilter, active, onReset}: {
  filter: string | null;
  setFilter: (val: string) => void;
  active: boolean;
  onReset: () => void
}) {
  const t = useTranslations('BrowsePage');

  return (
      <div className="w-full flex flex-row gap-2 mt-2 sm:mt-0">
        <div className="w-full relative text-secondary">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
          <Input
              className="pl-9 border-neutral-700 focus-visible:ring-0 focus-visible:outline-hidden"
              type="text"
              placeholder={t("sidebar.search_filters")}
              value={filter || ''}
              onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {active &&
            <Button size="icon" className="text-primary border-secondary-alt" variant="outline" onClick={onReset}>
                <div className="px-4">
                    <FilterXIcon className="w-4 h-4"/>
                </div>
            </Button>
        }
      </div>
  )
}

function Category({name, icon: Icon, checked, onChange}: {
  name: string;
  icon: any;
  checked: boolean;
  onChange: (checked: boolean) => Promise<void>;
}) {
  return (
      <div className="flex flex-row items-center gap-x-2">
        <Checkbox className="border-neutral-600"
                  checked={checked}
                  onCheckedChange={(e) => onChange(e == true)}/>
        <Icon className="w-4 h-4"/>
        <span className="text-sm text-primary">{name}</span>
      </div>
  )
}

function SearchCategories({categories, setCategories, filter}: {
  categories: string[] | null;
  setCategories: (val: string[]) => Promise<unknown>;
  filter: string | null;
}) {
  const t = useTranslations('SearchProjectTypes');
  const u = useTranslations('BrowsePage');
  const available = [
    {id: 'mod', icon: BoxIcon, name: t('mod')},
    {id: 'modpack', icon: PackageOpenIcon, name: t('modpack')},
    {id: 'resourcepack', icon: PaintbrushIcon, name: t('resourcepack')},
    {id: 'datapack', icon: BracesIcon, name: t('datapack')},
    {id: 'shader', icon: SwatchBookIcon, name: t('shader')},
    {id: 'plugin', icon: UnplugIcon, name: t('plugin')},
  ];

  const displayed = available
      .filter(v => !filter || v.name.toLowerCase().includes(filter.trim().toLowerCase()));

  async function setCategory(id: string, checked: boolean) {
    if (checked) {
      await setCategories([...(categories || []), id]);
    } else {
      await setCategories((categories || []).filter(v => v !== id));
    }
  }

  return displayed.length === 0 ? null : (
      <div className="my-2 px-2">
        <Accordion type="single" defaultValue={"categories"} collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger>
              {u('sidebar.categories')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-3.5 pb-2">
                {...displayed
                    .map((type) => (
                        <Category key={type.id} icon={type.icon} name={type.name}
                                  checked={categories?.includes(type.id) || false}
                                  onChange={(v) => setCategory(type.id, v)}/>
                    ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
}

export default function BrowseFilterPanel() {
  const [categories, setCategories] = useQueryState('types', parseAsArrayOf(parseAsString, ',').withOptions({shallow: false}));

  const [filter, setFilter] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);

  async function handleReset() {
    await setCategories(null);
  }

  useEffect(() => {
    setActive(categories != null && categories.length > 0);
  }, [categories]);

  return (
      <>
        <FilterSearch filter={filter} setFilter={setFilter} active={active} onReset={handleReset}/>

        <SearchCategories categories={categories} setCategories={setCategories} filter={filter}/>
      </>
  );
}