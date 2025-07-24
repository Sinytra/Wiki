import {CN, CZ, DE, ES, FR, HU, IT, JP, KR, MY, PL, RU, SE, TR, TW, UA, US} from "country-flag-icons/react/3x2";

export type LanguageMap = {[key: string]: Language};

export type PathPrefixMap = Record<string, string>;

export interface Language {
  /** Language name */
  name: string;
  /** Language icon */
  icon: any;
  /** File name */
  file: string;
  /** Crowdin language id */
  crowdin?: string;
  /** URL path param */
  prefix?: string;
  /** Right To Left spelling **/
  rtl?: boolean;
}

const DEFAULT_LOCALE = 'en_us';

/** @returns {LanguageMap} */
function getAvailableLocales(): LanguageMap {
  return {
    en: { name: 'English', file: 'en_US', icon: US },
    de: { name: 'Deutsch', file: 'de_DE', icon: DE },
    fr: { name: 'Français', file: 'fr_FR', icon: FR },
    es: { name: 'Español', file: 'es_ES', crowdin: 'es-ES', icon: ES },
    it: { name: 'Italiano', file: 'it_IT', icon: IT },
    cs: { name: 'Čeština', file: 'cs_CZ', icon: CZ },
    hu: { name: 'Magyar', file: 'hu_HU', icon: HU },
    pl: { name: 'Polski', file: 'pl_PL', icon: PL },
    ms: { name: 'Bahasa Melayu', file: 'ms_MY', icon: MY },
    'ms-Arab': { name: 'بهاس ملايو', file: 'ms_Arab', prefix: 'ms_Ar', icon: MY, rtl: true },
    tr: { name: 'Türkçe', file: 'tr_TR', icon: TR },
    sv: { name: 'Svenska', file: 'sv_SE', crowdin: 'sv-SE', icon: SE },
    uk: { name: 'Українська', file: 'uk_UA', icon: UA },
    ru: { name: 'Русский', file: 'ru_RU', icon: RU },
    ja: { name: '日本語', file: 'ja_JP', icon: JP },
    ko: { name: '한국어', file: 'ko_KR', icon: KR },
    'zh-CN': { name: '简体中文', file: 'zh_CN', prefix: 'zh_cn', icon: CN },
    'zh-TW': { name: '繁體中文', file: 'zh_TW', prefix: 'zh_tw', icon: TW }
  };
}

function getLanguagePaths(): string[] {
  return Object.entries(getAvailableLocales()).map(e => e[1].prefix || e[0]);
}

function getNextIntlLocales(): string[] {
  return Object.keys(getAvailableLocales());
}

function getNextIntlInternal(locale: string): string {
  return Object.entries(getAvailableLocales()).find(e => e[0] === locale || e[1].prefix === locale)?.[0] || locale;
}

function getPathPrefixes(): PathPrefixMap {
  return Object.entries(getAvailableLocales())
      .filter(e => e[1].prefix !== undefined)
      .reduce((p, e) => ({...p, [e[0]]: '/' + e[1].prefix}), {});
}

function getForUrlParam(locale: string): Language | undefined {
  return Object.entries(getAvailableLocales())
    .find(e => e[0] === locale || e[1].prefix === locale)?.[1];
}

function getCrowdinLanguageId(locale: string): string | undefined {
  const entry = Object.entries(getAvailableLocales()).find(e => e[0] === locale || e[1].prefix === locale);
  return entry?.[1].crowdin || entry?.[0];
}

function isRTL(locale: string): boolean {
  return getForUrlParam(locale)?.rtl || false;
}

function actualLocale(locale: string | null): string | null {
  if (!locale || locale === DEFAULT_LOCALE) {
    return null;
  }
  const loc = getForUrlParam(locale);
  return loc?.file.toLowerCase() ?? null;
}

export default {
  getAvailableLocales,
  getLanguagePaths,
  getNextIntlLocales,
  getPathPrefixes,
  getForUrlParam,
  getNextIntlInternal,
  getCrowdinLanguageId,
  isRTL,
  actualLocale
};