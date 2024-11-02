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
}
