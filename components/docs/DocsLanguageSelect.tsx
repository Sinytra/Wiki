'use client'

import available from "@/lib/locales/available";
import {Language, LanguageMap} from "@/lib/types/available";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Globe} from "lucide-react";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from "next-nprogress-bar";
import {useTranslations} from "next-intl";
import clientUtil from "@/lib/util/clientUtil";

export default function DocsLanguageSelect({locale, locales}: { locale: string; locales: string[] }) {
  const allLocales = available.getAvailableLocales();

  const projectLocaleKeys = locales?.map(l =>
    Object.entries(available.getAvailableLocales())
      .find(([key, val]) => key === l.split('_')[0] || (val as Language).prefix === l || key == l)?.[0]
  ).filter(l => l !== undefined) || [];
  const dropdownLocaleKeys = ['en', ...projectLocaleKeys];

  const dropdownLanguages: LanguageMap = Object.keys(allLocales)
    .filter(k => dropdownLocaleKeys.includes(k))
    .reduce((obj: any, key) => {
      obj[key] = allLocales[key];
      return obj;
    }, {});

  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
  };

  // Prevent badly engineered anti-scroll mechanism from breaking our view
  clientUtil.usePreventBuggyScrollLock();

  const t = useTranslations('DocsLanguageSelect');

  let selectedLanguageId = available.getNextIntlInternal(locale);
  let selectedValue = Object.keys(dropdownLanguages).includes(selectedLanguageId) ? locale : 'en';

  return (
    <Select value={selectedValue} onValueChange={changeLocale}>
      <SelectTrigger className="sm:w-fit sm:min-w-24 sm:max-w-32 h-7 py-0 rounded-sm [&>span]:text-sm bg-transparent
                              hover:bg-secondary border-none justify-start [&>svg:last-child]:hidden
                              [&>span]:text-ellipsis [&>span]:block whitespace-nowrap">
        <Globe className="size-3.5 mr-2.5"/>
        <SelectValue placeholder={t('placeholder')}/>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(dropdownLanguages).map(([id, loc]) => (
          <SelectItem key={id} value={loc.prefix || id}>
            {loc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}