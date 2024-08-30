import {createI18nServer} from 'next-international/server'
import {getAvailableLocales} from "@/locales/available";

export const {getI18n, getScopedI18n, getStaticParams} = createI18nServer(getAvailableLocales());