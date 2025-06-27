import en from '@/messages/en_US.json';
 
type Messages = typeof en;
 
declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}