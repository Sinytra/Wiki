import {createI18nServer} from 'next-international/server'
import {getAvailableLocales} from "@/lib/locales/available";

export const {getI18n, getScopedI18n, getStaticParams, getCurrentLocale} = createI18nServer(getAvailableLocales());