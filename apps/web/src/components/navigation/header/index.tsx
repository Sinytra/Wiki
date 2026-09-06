import { ReactNode } from 'react';
import styles from './style.module.css';
import { Badge } from '@repo/ui/components/badge';
import LanguageSelect from '@/components/navigation/LanguageSelect';
import HeaderBase from '@/components/navigation/header/HeaderBase';
import { LocaleNavLink } from '@/components/navigation/link/LocaleNavLink';
import { cn } from '@repo/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { BookMarkedIcon, CompassIcon } from 'lucide-react';
import DocsSearchBar from '@/components/navigation/search/DocsSearchBar';
import MobileNav from '@/components/navigation/header/MobileNav';
import SocialButtons from '@/components/util/SocialButtons';
import MobileDocsSearch from '@/components/navigation/search/MobileDocsSearch';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import env from '@repo/shared/env';
import { Button } from '@repo/ui/components/button';
import AppearanceMenu from '@/components/navigation/appearance/AppearanceMenu';

function Brand({ preview }: { preview: boolean }) {
  const t = useTranslations('NavigationHeader');

  return (
    <div className="flex shrink-0 flex-row items-center gap-3">
      <LocaleNavLink href="/" className="group relative flex flex-row items-center gap-0.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-sm">
          <BookMarkedIcon className="size-4" />
        </span>
        <span className="text-base font-medium text-primary group-hover:text-primary-alt">
          <span className="inline">{t('title')}</span>
        </span>
      </LocaleNavLink>

      {preview && (
        <Badge variant="secondary" className="hidden lg:inline-flex">
          {t('badge.preview')}
        </Badge>
      )}
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 border-l border-tertiary" />;
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <LocaleNavLink
      className={cn(styles.menuLink, 'px-1 text-base font-medium text-primary first:pl-0 sm:px-1.5 lg:px-2.5')}
      href={href}
    >
      {children}
    </LocaleNavLink>
  );
}

function DevAreaButton({ mobile }: { mobile?: boolean }) {
  const t = useTranslations('NavigationHeader');

  return (
    <Button asChild variant="ghost" size="sm" className={cn('gap-2 text-primary', mobile ? 'h-9 w-full' : 'h-8 px-2')}>
      <LocaleNavLink href="/dev">{t('link.developers')}</LocaleNavLink>
    </Button>
  );
}

function MobileHeaderLink({
  href,
  icon: Icon,
  children
}: {
  href: string;
  icon: typeof CompassIcon;
  children: ReactNode;
}) {
  return (
    <LocaleNavLink
      href={href}
      className={cn(
        styles.menuLink,
        'flex flex-row items-center gap-3 rounded-sm px-2 py-2 text-base text-primary hover:bg-secondary'
      )}
    >
      <Icon className="size-4 text-secondary" />
      {children}
    </LocaleNavLink>
  );
}

export default function Header({ locale, minimal, unfix }: { locale: string; minimal?: boolean; unfix?: boolean }) {
  const preview = env.isPreview();
  const t = useTranslations('NavigationHeader');

  const showLinks = !preview && !minimal;
  const showSearch = !preview && !minimal;

  return (
    <HeaderBase unfix={unfix}>
      <div className="pointer-events-auto! z-50 mx-auto flex h-nav max-w-7xl flex-row items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-fit flex-1 flex-row items-center">
          <Brand preview={preview} />
        </div>

        {showSearch && (
          <ClientLocaleProvider keys={['DocsSearchBar', 'ProjectTypes', 'SearchResultType']}>
            <DocsSearchBar locale={locale} />
          </ClientLocaleProvider>
        )}

        {/* Desktop */}
        <div className="hidden min-w-fit flex-1 flex-row items-center justify-end gap-0.5 sm:flex">
          {showLinks && (
            <>
              <nav className="flex flex-row items-center gap-0.5">
                <HeaderLink href="/browse">{t('link.browse')}</HeaderLink>
              </nav>
            </>
          )}

          <Divider />

          {!minimal && (
            <>
              <ClientLocaleProvider keys={['LanguageSelect']}>
                <LanguageSelect locale={locale} />
              </ClientLocaleProvider>
            </>
          )}

          <ClientLocaleProvider keys={['AppearanceMenu']}>
            <AppearanceMenu />
          </ClientLocaleProvider>

          {showLinks && (
            <>
              <DevAreaButton />
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="ml-auto flex flex-row items-center gap-1 sm:hidden">
          {showSearch && (
            <ClientLocaleProvider keys={['DocsSearchBar', 'ProjectTypes', 'SearchResultType']}>
              <MobileDocsSearch locale={locale} />
            </ClientLocaleProvider>
          )}

          <MobileNav>
            <nav className="flex flex-col gap-1">
              {showLinks && (
                <>
                  <MobileHeaderLink href="/browse" icon={CompassIcon}>
                    {t('link.browse')}
                  </MobileHeaderLink>
                  <hr className="my-2 border-tertiary" />
                </>
              )}

              {!minimal && (
                <ClientLocaleProvider keys={['LanguageSelect']}>
                  <LanguageSelect mobile locale={locale} />
                </ClientLocaleProvider>
              )}
              <ClientLocaleProvider keys={['AppearanceMenu']}>
                <AppearanceMenu mobile />
              </ClientLocaleProvider>

              {showLinks && (
                <div className="mt-3">
                  <DevAreaButton mobile />
                </div>
              )}

              <hr className="my-4 border-tertiary" />
              <div className="mx-auto">
                <SocialButtons large />
              </div>
            </nav>
          </MobileNav>
        </div>
      </div>
    </HeaderBase>
  );
}
