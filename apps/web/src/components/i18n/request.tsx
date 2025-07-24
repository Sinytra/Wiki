import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import locales from "@repo/lang/locales";
import deepmerge from "deepmerge";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) ?? 'locale';
  const lang = locales.getForUrlParam(locale);
  if (!lang) {
    notFound();
  }

  const langMessages = (await import(`../../messages/${lang.file}.json`)).default;
  const defaultMessages = (await import(`../../messages/en_US.json`)).default;
  const messages = deepmerge(defaultMessages, langMessages);

  return {
    locale,
    messages
  };
});