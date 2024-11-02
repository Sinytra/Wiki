import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import available from "@/lib/locales/available";

export default getRequestConfig(async ({locale}) => {
  const lang = available.getForUrlParam(locale);
  if (!lang) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${lang.file}.json`)).default
  };
});