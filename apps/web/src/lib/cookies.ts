import Cookies from 'js-cookie';

const CONSENT_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE'
];

export const USER_COUNTRY_COOKIE = 'wiki-user-country';

function userRequiresCookieConsent() {
  if (process.env.NEXT_PUBLIC_DISABLE_COOKIE_CONSENT == 'true') {
    return false;
  }

  const country = Cookies.get(USER_COUNTRY_COOKIE);
  return !country || CONSENT_COUNTRIES.includes(country);
}

export default {
  userRequiresCookieConsent
}