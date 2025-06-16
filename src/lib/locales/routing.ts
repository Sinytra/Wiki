import {defineRouting} from "next-intl/routing";
import {createNavigation} from "next-intl/navigation";
import {setRequestLocale} from "next-intl/server";
import available from "@/lib/locales/available";

export const routing = defineRouting({
  locales: available.getNextIntlLocales(),
  defaultLocale: 'en',
  localePrefix: {
    mode: 'always',
    prefixes: available.getPathPrefixes()
  }
});

export function setContextLocale(locale: string) {
  const internal = available.getNextIntlInternal(locale);
  setRequestLocale(internal);
}

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);