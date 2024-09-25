function getAvailableLocales()/*: Record<string, () => Promise<any>>*/ {
  return {
    en: async () => ({}),
    de: async () => ({}),
    fr: async () => ({}),
    es: async () => ({}),
    it: async () => ({}),
    cs: async () => ({}),
    hu: async () => ({}),
    pl: async () => ({}),
    sv: async () => ({}),
    uk: async () => ({}),
    ru: async () => ({}),
    ja: async () => ({}),
    ko: async () => ({}),
    zh: async () => ({}),
  };
}

const available = {
  getAvailableLocales
}

export default available;