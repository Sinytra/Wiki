import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import locales, { DEFAULT_LOCALE_INTERNAL } from '@repo/shared/locales';
import deepmerge from 'deepmerge';

export default getRequestConfig(async ({ requestLocale }) => {
  const internalCode = (await requestLocale) ?? DEFAULT_LOCALE_INTERNAL;
  const lang = locales.getForInternalCode(internalCode);
  if (!lang) {
    console.error('Locale not found:', internalCode);
    notFound();
  }

  const langMessages = (await import(`../../messages/${lang.file}.json`)).default;
  const defaultMessages = (await import('../../messages/en_US.json')).default;
  const messages = deepmerge(defaultMessages, langMessages);

  return {
    locale: internalCode,
    messages
  };
});
