export type Theme = 'auto' | 'light' | 'dark';
export type ReadingWidth = 'narrow' | 'wide';

export const THEMES: Theme[] = ['auto', 'light', 'dark'];
export const READING_WIDTHS: ReadingWidth[] = ['narrow', 'wide'];

export interface AppearanceSettings {
  theme: Theme;
  width: ReadingWidth;
}

export const APPEARANCE_STORAGE_KEYS = {
  theme: 'wiki.appearance.theme',
  width: 'wiki.appearance.width'
} as const;

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'dark',
  width: 'narrow'
};

export const THEME_CLASS_PREFIX = 'theme-';
export const READING_WIDTH_CLASS_PREFIX = 'reading-width-';

export interface ApplyAppearanceOptions {
  keys: typeof APPEARANCE_STORAGE_KEYS;
  defaults: AppearanceSettings;
  themes: readonly string[];
  widths: readonly string[];
  themeClassPrefix: string;
  widthClassPrefix: string;
}

// Function is inlined
export function applyStoredAppearance(options: ApplyAppearanceOptions) {
  const root = document.documentElement;

  function read(key: string, allowed: readonly string[], fallback: string): string {
    try {
      const value = window.localStorage.getItem(key);
      return value && allowed.includes(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function swapClass(prefix: string, allowed: readonly string[], value: string) {
    allowed.forEach((v) => root.classList.remove(prefix + v));
    root.classList.add(prefix + value);
  }

  const theme = read(options.keys.theme, options.themes, options.defaults.theme);
  const width = read(options.keys.width, options.widths, options.defaults.width);

  // Dark is the default while light mode is experimental
  const resolvedTheme = theme === 'auto' ? 'dark' : theme;

  root.setAttribute('data-theme', resolvedTheme);
  root.classList.toggle('cc--darkmode', resolvedTheme === 'dark'); // For cookie banner
  swapClass(options.themeClassPrefix, options.themes, theme);
  swapClass(options.widthClassPrefix, options.widths, width);
}

export const APPLY_APPEARANCE_OPTIONS: ApplyAppearanceOptions = {
  keys: APPEARANCE_STORAGE_KEYS,
  defaults: DEFAULT_APPEARANCE,
  themes: THEMES,
  widths: READING_WIDTHS,
  themeClassPrefix: THEME_CLASS_PREFIX,
  widthClassPrefix: READING_WIDTH_CLASS_PREFIX
};

export function applyAppearance() {
  applyStoredAppearance(APPLY_APPEARANCE_OPTIONS);
}

export function loadAppearance(): AppearanceSettings {
  const read = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
    try {
      const value = window.localStorage.getItem(key);
      return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    theme: read(APPEARANCE_STORAGE_KEYS.theme, THEMES, DEFAULT_APPEARANCE.theme),
    width: read(APPEARANCE_STORAGE_KEYS.width, READING_WIDTHS, DEFAULT_APPEARANCE.width)
  };
}

export function saveAppearance(settings: AppearanceSettings) {
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEYS.theme, settings.theme);
    window.localStorage.setItem(APPEARANCE_STORAGE_KEYS.width, settings.width);
  } catch (e) {
    console.error('Error saving appearance settings', e);
  }
  applyAppearance();
}
