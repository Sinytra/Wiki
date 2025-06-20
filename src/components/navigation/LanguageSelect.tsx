'use client'

import styles from "@/components/navigation/header/style.module.css";
import {Check, ChevronDown, Globe, LanguagesIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from '@bprogress/next';
import * as React from "react";
import {useState} from "react";
import available from "@/lib/locales/available";
import {cn} from "@repo/ui/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/ui/components/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@repo/ui/components/command";
import {useTranslations} from "next-intl";
import {DEFAULT_LOCALE} from "@repo/shared/constants";
import {Language} from "@/lib/types/available";
import CountryFlag from "@repo/ui/util/CountryFlag";

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

  const availableKeys = Object.keys(availableLocales);
  const coercedLocale = availableKeys.includes(locale) ? locale : DEFAULT_LOCALE;

  const [value, setValue] = useState(coercedLocale);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
  };

  const lang = available.getNextIntlInternal(coercedLocale);
  const selectedLang = available.getForUrlParam(coercedLocale);
  const ordered = [lang, ...availableKeys.filter(k => k != lang)];

  return (
    <div className={cn(minimal && 'w-full', !mobile && !minimal && styles.socialLinks)}>
      <div className={cn(minimal && 'w-full')}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {minimal ?
              <button className={`
                test-center ring-offset-background flex h-8 w-full items-center justify-start rounded-sm border-none
                bg-transparent px-2 py-0 text-sm whitespace-nowrap placeholder:text-secondary hover:bg-secondary
                focus:outline-hidden sm:h-7 sm:w-fit sm:max-w-32 sm:min-w-24 [&>svg:last-child]:hidden
              `}
              >
                <Globe className="mr-2.5 size-3.5 shrink-0"/>
                <div className="mx-auto inline-flex gap-2 sm:hidden">
                  <CountryFlag className="rounded-xs!" flag={selectedLang.icon}/>
                  <span className="line-clamp-1 text-sm text-ellipsis">{selectedLang.name}</span>
                </div>
                <span className="line-clamp-1 hidden text-sm text-ellipsis sm:block">
                  {selectedLang.name}
                </span>
              </button>
              :
              <Button variant="outline" role="combobox" aria-expanded={open} className={`
                justify-between border-none bg-transparent px-2 py-1
              `}>
                  <LanguagesIcon className="h-5 w-5"/>
                  {mobile &&
                    <div className="mr-2 ml-3 inline-flex gap-2">
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
                          className={cn('pointer-events-auto! p-0', !mobile && 'w-48 sm:w-48',
                                        minimal && 'w-[var(--radix-popover-trigger-width)]')}>
            <Command value={value} defaultValue={value}>
              <CommandInput placeholder={t('placeholder')}/>
              <CommandList
                className={`
                  overscroll-contain
                  [scrollbar-color:var(--background-color-inverse-secondary)_var(--background-color-primary)]
                `}>
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
                        className={cn(`
                          hover:bg-secondary hover:text-primary-alt inline-flex w-full items-center justify-start gap-3
                        `, value == actualId && `pointer-events-none`)}
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