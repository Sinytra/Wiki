'use client';

import cn from 'clsx';
import {addBasePath} from 'next/dist/client/add-base-path';
import {Select} from 'nextra/components';
import {GlobeIcon} from 'nextra/icons';
import {usePathname} from 'next/navigation';
import {languages} from '@/lang';

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

interface LocaleSwitchProps {
  locale: string
  defaultLocale: string
  locales: string[]
  lite?: boolean
  className?: string
}

export default function LocaleSwitch({locale, locales, defaultLocale, lite, className}: LocaleSwitchProps) {
  const i18n = languages;
  const pathname = usePathname();

  return (
    <Select
      title="Change language"
      className={cn('x:flex x:items-center x:gap-2', className)}
      onChange={lang => {
        const date = new Date(Date.now() + ONE_YEAR);
        document.cookie = `NEXT_LOCALE=${lang}; expires=${date.toUTCString()}; path=/`;

        const parts = pathname.substring(1).split('/');
        if (locales.includes(parts[0]!)) {
          if (lang == defaultLocale) {
            parts.shift();
          } else {
            parts[0] = lang;
          }
        } else if (lang != defaultLocale) {
          parts.unshift(lang);
        }
        const newPath = `/${parts.join('/')}`;

        location.href = addBasePath(newPath);
      }}
      value={locale}
      selectedOption={
        <>
          <GlobeIcon height="12"/>
          {!lite && i18n.find(l => locale === l.locale)?.name}
        </>
      }
      options={i18n.map(l => ({
        id: l.locale,
        name: l.name
      }))}
    />
  );
}