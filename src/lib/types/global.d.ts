import messages from '@/messages/en_US.json';
 
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}