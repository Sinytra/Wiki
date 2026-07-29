import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { setRequestLocale } from 'next-intl/server';
import locales, { DEFAULT_LOCALE_INTERNAL } from '@repo/shared/locales';

export const routing = defineRouting({
  locales: locales.getInternalCodes(),
  defaultLocale: DEFAULT_LOCALE_INTERNAL,
  localePrefix: {
    mode: 'always',
    prefixes: locales.getPathPrefixes()
  }
});

export function setContextLocale(locale: string) {
  const internal = locales.getForUrlParam(locale)?.internal || locale;
  setRequestLocale(internal);
}

export const { Link: LocaleLink, redirect, usePathname, useRouter } = createNavigation(routing);
