function getAvailableLocales()/*: Record<string, () => Promise<any>>*/ {
  return {
    en: async () => ({}),
    de: async () => ({}),
    fr: async () => ({}),
    es: async () => ({}),
    it: async () => ({}),
    cz: async () => ({}),
    hu: async () => ({}),
    pl: async () => ({}),
    sw: async () => ({}),
    ua: async () => ({}),
    ru: async () => ({}),
    jp: async () => ({}),
    kr: async () => ({}),
    cn: async () => ({}),
  };
}

export default {
  getAvailableLocales
}