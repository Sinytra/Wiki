import {defineRouting} from "next-intl/routing";
import {createSharedPathnamesNavigation} from "next-intl/navigation";
import {unstable_setRequestLocale} from "next-intl/server";
import available from "@/lib/locales/available";

export const routing = defineRouting({
  locales: Object.keys(available.getAvailableLocales()),
  defaultLocale: 'en',
  localePrefix: 'always'
});

export function setContextLocale(locale: string) {
  unstable_setRequestLocale(locale);
}

export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing);