'use client'

import {createI18nClient} from 'next-international/client';
import {getAvailableLocales} from "@/lib/locales/available";

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale
} = createI18nClient(getAvailableLocales());