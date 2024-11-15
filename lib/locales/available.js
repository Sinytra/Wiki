import {CN, CZ, DE, ES, FR, GB, HU, IT, JP, KR, PL, RU, SE, TW, UA} from "country-flag-icons/react/3x2";

/** @returns {LanguageMap} */
function getAvailableLocales() {
  return {
    en: { name: 'English', file: 'en', icon: GB },
    de: { name: 'Deutsch', file: 'de_DE', icon: DE },
    fr: { name: 'Français', file: 'fr_FR', icon: FR },
    es: { name: 'Español', file: 'es_ES', crowdin: 'es-ES', icon: ES },
    it: { name: 'Italiano', file: 'it_IT', icon: IT },
    cs: { name: 'Čeština', file: 'cs_CZ', icon: CZ },
    hu: { name: 'Magyar', file: 'hu_HU', icon: HU },
    pl: { name: 'Polski', file: 'pl_PL', icon: PL },
    sv: { name: 'Svenska', file: 'sv_SE', crowdin: 'sv-SE', icon: SE },
    uk: { name: 'Українська', file: 'uk_UA', icon: UA },
    ru: { name: 'русский', file: 'ru_RU', icon: RU },
    ja: { name: '日本語', file: 'ja_JP', icon: JP },
    ko: { name: '한국어', file: 'ko_KR', icon: KR },
    'zh-CN': { name: '简体中文', file: 'zh_CN', prefix: 'zh_cn', icon: CN },
    'zh-TW': { name: '繁體中文', file: 'zh_TW', prefix: 'zh_tw', icon: TW }
  };
}

/** @returns string[] */
function getLanguagePaths() {
  return Object.entries(getAvailableLocales()).map(e => e[1].prefix || e[0]);
}

/** @returns string[] */
function getNextIntlLocales() {
  return Object.keys(getAvailableLocales());
}

/**
 * @param locale {string}
 * @returns string
 */
function getNextIntlInternal(locale) {
  return Object.entries(getAvailableLocales()).find(e => e[0] === locale || e[1].prefix === locale)?.[0] || locale;
}

/** @returns PathPrefixMap */
function getPathPrefixes() {
  return Object.entries(getAvailableLocales())
      .filter(e => e[1].prefix !== undefined)
      .reduce((p, e) => ({...p, [e[0]]: '/' + e[1].prefix}), {});
}

/**
 * @param locale {string}
 * @returns Language
 */
function getForUrlParam(locale) {
  return Object.entries(getAvailableLocales()).find(e => e[0] === locale || e[1].prefix === locale)?.[1];
}

/**
 * @param locale {string}
 * @returns string
 */
function getCrowdinLanguageId(locale) {
  const entry = Object.entries(getAvailableLocales()).find(e => e[0] === locale || e[1].prefix === locale);
  return entry[1].crowdin || entry[0];
}

const available = {
  getAvailableLocales,
  getLanguagePaths,
  getNextIntlLocales,
  getPathPrefixes,
  getForUrlParam,
  getNextIntlInternal,
  getCrowdinLanguageId
}

export default available;