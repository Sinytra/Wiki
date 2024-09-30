export interface Language {
  name: string;
  icon: any;
}

export declare function getAvailableLocales(): {[key: string]: Language};

export = getAvailableLocales;