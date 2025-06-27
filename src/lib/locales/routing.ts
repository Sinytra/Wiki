import {defineRouting} from "next-intl/routing";
import {createNavigation} from "next-intl/navigation";
import {setRequestLocale} from "next-intl/server";
import locales from "@repo/shared/lang/locales";

export const routing = defineRouting({
  locales: locales.getNextIntlLocales(),
  defaultLocale: 'en',
  localePrefix: {
    mode: 'always',
    prefixes: locales.getPathPrefixes()
  }
});

export function setContextLocale(locale: string) {
  const internal = locales.getNextIntlInternal(locale);
  setRequestLocale(internal);
}

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);