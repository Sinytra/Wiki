import {CN, CZ, DE, ES, FR, GB, HU, IT, JP, KR, PL, RU, SE, UA} from "country-flag-icons/react/3x2";

function getAvailableLocales() {
  return {
    en: { name: 'English', icon: GB },
    de: { name: 'Deutsch', icon: DE },
    fr: { name: 'Français', icon: FR },
    es: { name: 'Español', icon: ES },
    it: { name: 'Italiano', icon: IT },
    cs: { name: 'Čeština', icon: CZ },
    hu: { name: 'Magyar', icon: HU },
    pl: { name: 'Polski', icon: PL },
    sv: { name: 'Svenska', icon: SE },
    uk: { name: 'Українська', icon: UA },
    ru: { name: 'русский', icon: RU },
    ja: { name: '日本語', icon: JP },
    ko: { name: '한국어', icon: KR },
    zh: { name: '中文', icon: CN }
  };
}

const available = {
  getAvailableLocales
}

export default available;