'use client'

import styles from "@/components/navigation/header/style.module.css";
import {Check, ChevronDown, Globe, LanguagesIcon} from "lucide-react";
import CountryFlag from "@/components/util/CountryFlag";
import {Button} from "@/components/ui/button";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from '@bprogress/next';
import * as React from "react";
import {useState} from "react";
import available from "@/lib/locales/available";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useTranslations} from "next-intl";
import {DEFAULT_LOCALE} from "@/lib/constants";
import {Language} from "@/lib/types/available";

export default function LanguageSelect({locale, locales, mobile, minimal}: {
  locale: string;
  locales?: string[];
  mobile?: boolean;
  minimal?: boolean;
}) {
  const t = useTranslations('LanguageSelect');

  const allLocales = available.getAvailableLocales();
  const availableLocales = locales ? Object.entries(allLocales)
    .filter(([key, val]) => key == DEFAULT_LOCALE || locales.includes(key)
      || locales.includes(`${key}_${key}`) || (val as Language).prefix && locales.includes((val as any).prefix))
    .reduce((obj: any, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {}) : allLocales;
  const [value, setValue] = useState(locale);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
  };

  const lang = available.getNextIntlInternal(locale);
  const selectedLang = available.getForUrlParam(locale);
  const ordered = [lang, ...Object.keys(availableLocales).filter(k => k != lang)];

  return (
    <div className={cn(!mobile && !minimal && styles.socialLinks)}>
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {minimal ?
              <button className="flex w-full items-center text-sm ring-offset-background placeholder:text-secondary
                                 focus:outline-hidden sm:w-fit sm:min-w-24 sm:max-w-32 h-7 px-2 py-0 test-center
                                 rounded-sm bg-transparent border-none justify-start hover:bg-secondary
                                 [&>span]:line-clamp-1 [&>span]:text-sm [&>svg:last-child]:hidden
                                 [&>span]:text-ellipsis [&>span]:w-full [&>span]:block whitespace-nowrap"
              >
                <Globe className="size-3.5 mr-2.5 shrink-0"/>
                <span>{selectedLang.name}</span>
              </button>
              :
              <Button variant="outline" role="combobox" aria-expanded={open} className="px-2 py-1 bg-transparent border-none justify-between">
                  <LanguagesIcon className="w-5 h-5"/>
                  {mobile &&
                    <div className="inline-flex gap-2 ml-3 mr-2">
                      <CountryFlag className="rounded-xs!" flag={selectedLang.icon}/>
                      {selectedLang.name}
                    </div>
                  }
                  <ChevronDown
                    data-state={open ? 'open' : 'closed'}
                    className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
              </Button>
            }
          </PopoverTrigger>
          <PopoverContent align={mobile ? 'start' : 'end'}
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          className={cn('p-0 pointer-events-auto!', !mobile && 'w-48')}>
            <Command value={value} defaultValue={value}>
              <CommandInput placeholder={t('placeholder')}/>
              <CommandList
                className="[scrollbar-color:var(--background-color-inverse-secondary)_var(--background-color-primary)] overscroll-contain">
                <CommandEmpty>
                  {t('no_results')}
                </CommandEmpty>
                <CommandGroup>
                  {...ordered.map((id) => {
                    const {name, icon, prefix} = availableLocales[id];
                    let actualId = prefix || id;

                    return (
                      <CommandItem
                        key={id}
                        value={actualId}
                        className={cn('w-full inline-flex justify-start items-center gap-3 hover:bg-secondary hover:text-primary-alt', value == actualId && 'pointer-events-none')}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                          changeLocale(currentValue);
                        }}
                      >
                        <CountryFlag flag={icon}/> {name}
                        <Check className={cn("ml-auto h-4 w-4", value === actualId ? "opacity-100" : "opacity-0")}/>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}