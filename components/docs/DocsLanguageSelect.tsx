'use client'

import available from "@/lib/locales/available";
import {Language, LanguageMap} from "@/lib/types/available";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Globe} from "lucide-react";
import CountryFlag from "@/components/util/CountryFlag";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from "next-nprogress-bar";
import {useEffect} from "react";
import {useTranslations} from "next-intl";

export default function DocsLanguageSelect({locale, locales}: { locale: string; locales: string[] }) {
  const availableLocales = ['en', ...(locales?.map(l =>
    Object.entries(available.getAvailableLocales())
      .find(e => e[0] === l.split('_')[0] || (e[1] as Language).prefix === l || e[0] == l)
      ?.[0]
  )
    .filter(l => l !== undefined) || [])];
  const allLocales = available.getAvailableLocales();
  const selectableLocales: LanguageMap = availableLocales ? Object.keys(allLocales)
    .filter(k => availableLocales.includes(k))
    .reduce((obj: any, key) => {
      obj[key] = allLocales[key];
      return obj;
    }, {}) : allLocales;

  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
  };

  // Prevent badly engineered anti-scroll mechanism from breaking our view
  useEffect(() => {
    const el = document.querySelector('body')!;
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === 'data-scroll-locked') {
            (mutation.target as HTMLBodyElement).removeAttribute('data-scroll-locked')
          }
        }
      });
    });
    observer.observe(el, {attributes: true});
    return () => observer.disconnect();
  }, []);

  const t = useTranslations('DocsLanguageSelect');

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="w-[180px]">
        <Globe className="w-4 h-4 mr-1" />
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(selectableLocales).map(([id, loc]) => (
          <SelectItem key={id} value={id}>
            <CountryFlag className="inline-block mr-1" flag={loc.icon} /> {loc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}