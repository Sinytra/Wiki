import { CN, CZ, DE, ES, FR, HU, IT, JP, KR, MY, PL, RU, SE, TR, TW, UA, US } from 'country-flag-icons/react/3x2';

export type LanguageMap = { [key: string]: Language };

export type PathPrefixMap = Record<string, string>;

export interface Language {
  /** Language name */
  name: string;
  /** Language icon */
  icon: any;
  /** File name */
  file: string;
  /** Docs localization code **/
  code: string;
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
    en: { name: 'English', code: 'en_us', file: 'en_US', icon: US },
    cs: { name: 'Čeština', code: 'cs_cz', file: 'cs_CZ', icon: CZ },
    de: { name: 'Deutsch', code: 'de_de', file: 'de_DE', icon: DE },
    es: { name: 'Español', code: 'es_es', file: 'es_ES', crowdin: 'es-ES', icon: ES },
    fr: { name: 'Français', code: 'fr_fr', file: 'fr_FR', icon: FR },
    hu: { name: 'Magyar', code: 'hu_hu', file: 'hu_HU', icon: HU },
    it: { name: 'Italiano', code: 'it_it', file: 'it_IT', icon: IT },
    ja: { name: '日本語', code: 'ja_jp', file: 'ja_JP', icon: JP },
    ko: { name: '한국어', code: 'ko_kr', file: 'ko_KR', icon: KR },
    ms: { name: 'Bahasa Melayu', code: 'ms_my', file: 'ms_MY', icon: MY },
    'ms-Arab': {
      name: 'بهاس ملايو',
      code: 'zml_arab',
      file: 'ms_Arab',
      prefix: 'ms_Ar',
      icon: MY,
      rtl: true
    },
    pl: { name: 'Polski', code: 'pl_pl', file: 'pl_PL', icon: PL },
    ru: { name: 'Русский', code: 'ru_ru', file: 'ru_RU', icon: RU },
    sv: { name: 'Svenska', code: 'sv_se', file: 'sv_SE', crowdin: 'sv-SE', icon: SE },
    tr: { name: 'Türkçe', code: 'tr_tr', file: 'tr_TR', icon: TR },
    uk: { name: 'Українська', code: 'uk_ua', file: 'uk_UA', icon: UA },
    'zh-CN': { name: '简体中文', code: 'zh_cn', file: 'zh_CN', prefix: 'zh_cn', icon: CN },
    'zh-TW': { name: '繁體中文', code: 'zh_tw', file: 'zh_TW', prefix: 'zh_tw', icon: TW }
  };
}

function getLanguagePaths(): string[] {
  return Object.entries(getAvailableLocales()).map((e) => e[1].prefix || e[0]);
}

function getNextIntlLocales(): string[] {
  return Object.keys(getAvailableLocales());
}

function getNextIntlInternal(locale: string): string {
  return Object.entries(getAvailableLocales()).find((e) => e[0] === locale || e[1].prefix === locale)?.[0] || locale;
}

function getPathPrefixes(): PathPrefixMap {
  return Object.entries(getAvailableLocales())
    .filter((e) => e[1].prefix !== undefined)
    .reduce((p, e) => ({ ...p, [e[0]]: '/' + e[1].prefix }), {});
}

function getForUrlParam(locale: string): Language | undefined {
  return Object.entries(getAvailableLocales()).find((e) => e[0] === locale || e[1].prefix === locale)?.[1];
}

function getCrowdinLanguageId(locale: string): string | undefined {
  const entry = Object.entries(getAvailableLocales()).find((e) => e[0] === locale || e[1].prefix === locale);
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

function resolveParam(param: string) {
  return getForUrlParam(param)!.code;
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
  actualLocale,
  resolveParam
};
