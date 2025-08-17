export const defaultLocale = 'en';

export type Locale = 'en' | 'de';

export interface Language {
  locale: Locale;
  name: string;
}

export const languages: Language[] = [
  { locale: 'en', name: 'English' }
];

export const locales: Locale[] = languages.map(l => l.locale);