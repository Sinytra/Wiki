declare module '@repo/shared/lang/locales' {
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

  function getAvailableLocales(): LanguageMap;
  function getLanguagePaths(): string[];
  function getNextIntlLocales(): string[];
  function getNextIntlInternal(locale: string): string;
  function getPathPrefixes(): PathPrefixMap;
  function getForUrlParam(locale: string): Language;
  function getCrowdinLanguageId(locale: string): string;
  function isRTL(locale: string): boolean;
  function actualLocale(locale: string | null): string | null;

  export default {
    getAvailableLocales,
    getLanguagePaths,
    getNextIntlLocales,
    getNextIntlInternal,
    getPathPrefixes,
    getForUrlParam,
    getCrowdinLanguageId,
    isRTL,
    actualLocale
  };
}