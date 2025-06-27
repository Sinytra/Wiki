import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import locales from "@repo/shared/lang/locales";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) ?? 'locale';
  const lang = locales.getForUrlParam(locale);
  if (!lang) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${lang.file}.json`)).default
  };
});