import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/lib/locales/routing';
 
export default getRequestConfig(async ({locale}) => {
  if (!routing.locales.includes(locale as any)) notFound();
 
  return {
    messages: {}
  };
});