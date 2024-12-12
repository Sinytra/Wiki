import available from "@/lib/locales/available";
import {Language, LanguageMap} from "@/lib/types/available";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Globe} from "lucide-react";
import CountryFlag from "@/components/util/CountryFlag";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from "next-nprogress-bar";

export default function DocsLanguageSelect({locale, locales}: {locale: string; locales: string[]}) {
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

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="w-[180px]">
        <Globe className="w-4 h-4 mr-1" />
        <SelectValue placeholder="Select locale" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(selectableLocales).map(([id, loc]) => (
          <SelectItem key={id} value={id}>
            <span className="w-full inline-flex justify-start items-center gap-3">
              <CountryFlag flag={loc.icon} /> {loc.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}