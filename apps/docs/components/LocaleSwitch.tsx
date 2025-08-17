/*
 * MIT License
 *
 * Copyright (c) 2020 Shu Ding
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
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
      className={cn('x:flex x:items-center x:gap-2',
        'focus:ring-0 focus:ring-offset-0 focus-visible:outline-none!', className)}
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