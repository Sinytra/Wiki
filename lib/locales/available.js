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
    ua: async () => ({}),
    ru: async () => ({}),
    jp: async () => ({}),
    kr: async () => ({}),
    cn: async () => ({}),
  };
}

const available = {
  getAvailableLocales
}

export default available;