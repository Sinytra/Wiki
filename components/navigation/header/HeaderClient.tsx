'use client';

import {useState} from 'react';
import {NextIntlClientProvider} from "next-intl";
import DocsSearchBar from "@/components/navigation/DocsSearchBar";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import {searchWikiServer} from "@/lib/search/serverSearch";
import {MenuIcon, XIcon} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {ReactNode} from "react";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  // This can be a client component as well, rendering a link is safe.
  return (
    <LocaleNavLink href={href} className="text-foreground font-medium px-2 py-1 block">
      {children}
    </LocaleNavLink>
  );
}

export default function HeaderClient({
  locale,
  minimal,
  preview,
  t,
  docsMessages,
  searchFunc
}: {
  locale: string;
  minimal?: boolean;
  preview?: boolean;
  t: (key: string) => string;
  docsMessages: Record<string, any>;
  searchFunc: typeof searchWikiServer;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="sm:hidden px-4 py-2 border-t border-muted">
      <button
        className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
        onClick={toggleMenu}
        aria-label={'Toggle menu'}
      >
        {menuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {menuOpen && (
        <div className="mt-2">
          {!minimal && !preview && (
            <div className="my-2">
              {/* Provide translations for the search bar */}
              <NextIntlClientProvider messages={docsMessages}>
                <DocsSearchBar searchFunc={searchFunc} />
              </NextIntlClientProvider>
            </div>
          )}

          <nav className="flex flex-col gap-2 mt-2">
            {preview ? (
              <>
                <HeaderLink href="/preview">{t('link.home')}</HeaderLink>
                <HeaderLink href="/about">{t('link.about')}</HeaderLink>
              </>
            ) : (
              <>
                <HeaderLink href="/">{t('link.home')}</HeaderLink>
                {!minimal && (
                  <>
                    <HeaderLink href="/browse">{t('link.browse')}</HeaderLink>
                    <HeaderLink href="/about">{t('link.about')}</HeaderLink>
                  </>
                )}
              </>
            )}
          </nav>

          {!minimal && (
            <div className="mt-2">
              <LanguageSelect locale={locale} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
