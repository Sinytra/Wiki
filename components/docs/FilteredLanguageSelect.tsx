import available from "@/lib/locales/available";
import {Language} from "@/lib/types/available";
import LanguageSelect from "@/components/navigation/LanguageSelect";

export default function FilteredLanguageSelect({minimal, locales, locale}: {
  minimal?: boolean;
  locale: string;
  locales?: string[]
}) {
  const availableLocales = ['en', ...(locales?.map(l =>
    Object.entries(available.getAvailableLocales())
      .find(e => e[0] === l.split('_')[0] || (e[1] as Language).prefix === l || e[0] == l)
      ?.[0]
  )
    .filter(l => l !== undefined) || [])];

  return (
    <LanguageSelect minimal={minimal} smallOffset locale={locale as string} locales={availableLocales}/>
  );
}