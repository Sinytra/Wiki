import { CN, CZ, DE, ES, FR, HU, IT, JP, KR, MY, PL, RU, SE, TR, TW, UA, US } from 'country-flag-icons/react/3x2';

export type PathPrefixMap = Record<string, string>;

export interface Language {
  /** Language name */
  name: string;
  /** Docs localization code **/
  code: string;
  /** URL path param */
  prefix: string;
  /** File name */
  file: string;
  /** Internal lang code used by Next Intl */
  internal: string;
  /** Crowdin language id */
  crowdin?: string;
  /** Language icon */
  icon: any;
  /** Right To Left spelling **/
  rtl?: boolean;
}

export const DEFAULT_LOCALE_CODE = 'en_us';
export const DEFAULT_LOCALE_INTERNAL = 'en-US';

const LANGUAGES: Language[] = [
  { name: 'English', code: 'en_us', prefix: 'en', file: 'en_US', internal: 'en-US', icon: US },
  { name: 'Čeština', code: 'cs_cz', prefix: 'cs', file: 'cs_CZ', internal: 'cs-CZ', icon: CZ },
  { name: 'Deutsch', code: 'de_de', prefix: 'de', file: 'de_DE', internal: 'de-DE', icon: DE },
  { name: 'Español', code: 'es_es', prefix: 'es', file: 'es_ES', internal: 'es-ES', icon: ES, crowdin: 'es-ES' },
  { name: 'Français', code: 'fr_fr', prefix: 'fr', file: 'fr_FR', internal: 'fr-FR', icon: FR },
  { name: 'Magyar', code: 'hu_hu', prefix: 'hu', file: 'hu_HU', internal: 'hu-HU', icon: HU },
  { name: 'Italiano', code: 'it_it', prefix: 'it', file: 'it_IT', internal: 'it-IT', icon: IT },
  { name: '日本語', code: 'ja_jp', prefix: 'ja', file: 'ja_JP', internal: 'ja-JP', icon: JP },
  { name: '한국어', code: 'ko_kr', prefix: 'ko', file: 'ko_KR', internal: 'ko-KR', icon: KR },
  { name: 'Bahasa Melayu', code: 'ms_my', prefix: 'ms', file: 'ms_MY', internal: 'ms-MY', icon: MY },
  {
    name: 'بهاس ملايو',
    code: 'zml_arab',
    prefix: 'ms_Ar',
    file: 'ms_Arab',
    internal: 'ms-Arab',
    icon: MY,
    crowdin: 'ms-Arab',
    rtl: true
  },
  { name: 'Polski', code: 'pl_pl', prefix: 'pl', file: 'pl_PL', internal: 'pl-PL', icon: PL },
  { name: 'Русский', code: 'ru_ru', prefix: 'ru', file: 'ru_RU', internal: 'ru-RU', icon: RU },
  { name: 'Svenska', code: 'sv_se', prefix: 'sv', file: 'sv_SE', internal: 'sv-SE', icon: SE, crowdin: 'sv-SE' },
  { name: 'Türkçe', code: 'tr_tr', prefix: 'tr', file: 'tr_TR', internal: 'tr-TR', icon: TR },
  { name: 'Українська', code: 'uk_ua', prefix: 'uk', file: 'uk_UA', internal: 'uk-UA', icon: UA },
  { name: '简体中文', code: 'zh_cn', prefix: 'zh_cn', file: 'zh_CN', internal: 'zh-CN', icon: CN, crowdin: 'zh-CN' },
  { name: '繁體中文', code: 'zh_tw', prefix: 'zh_tw', file: 'zh_TW', internal: 'zh-TW', icon: TW, crowdin: 'zh-TW' }
];

function getAvailableLocales(): Language[] {
  return LANGUAGES;
}

function getLanguagePaths(): string[] {
  return LANGUAGES.map((lang) => lang.prefix);
}

function getInternalCodes(): string[] {
  return LANGUAGES.map((lang) => lang.internal);
}

function getPathPrefixes(): PathPrefixMap {
  return LANGUAGES.reduce((p, lang) => ({ ...p, [lang.internal]: '/' + lang.prefix }), {});
}

function getForUrlParam(locale: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.prefix === locale);
}

function getForInternalCode(internal: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.internal === internal);
}

function getUrlPrefixForCode(code: string): string | undefined {
  return LANGUAGES.find((lang) => lang.code === code)?.prefix;
}

function getCrowdinLanguageId(locale: string): string | undefined {
  const lang = getForUrlParam(locale);
  return lang?.crowdin || lang?.prefix;
}

function isRTL(locale: string): boolean {
  return getForUrlParam(locale)?.rtl || false;
}

function actualLocale(locale: string | null): string | null {
  if (!locale || locale === DEFAULT_LOCALE_CODE) {
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
  getInternalCodes,
  getPathPrefixes,
  getForUrlParam,
  getForInternalCode,
  getCrowdinLanguageId,
  isRTL,
  actualLocale,
  resolveParam,
  getUrlPrefixForCode
};
