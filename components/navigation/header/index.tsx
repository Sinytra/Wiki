import {ReactNode} from "react";
import styles from './style.module.css';
import localPreview from "@/lib/previewer/localPreview";
import {Badge} from "@/components/ui/badge";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import HeaderBase from "@/components/navigation/header/HeaderBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {BookMarkedIcon} from "lucide-react";
import DocsSearchBar from "@/components/navigation/DocsSearchBar";
import {searchWikiServer} from "@/lib/search/serverSearch";
import MobileNav from "@/components/navigation/header/MobileNav";
import SocialButtons from "@/components/ui/custom/SocialButtons";
import MobileDocsSearch from "@/components/navigation/MobileDocsSearch";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <LocaleNavLink href={href} className={`${styles.menuLink}
      px-1 text-base font-medium text-primary first:pl-0 sm:px-1.5 lg:px-2.5
    `}>
      {children}
    </LocaleNavLink>
  )
}

function MobileHeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <LocaleNavLink href={href} className={`${styles.menuLink}
      border-b border-[var(--vp-c-divider)] py-3 text-base font-normal text-primary
    `}>
      {children}
    </LocaleNavLink>
  )
}

export default function Header({locale, minimal, unfix}: { locale: string, minimal?: boolean, unfix?: boolean }) {
  const preview = localPreview.isEnabled();
  const t = useTranslations('NavigationHeader');

  return (
    <HeaderBase unfix={unfix}>
      <div
        className={cn(`
          pointer-events-auto! z-50 mx-auto flex h-nav max-w-[88rem] flex-row items-center justify-between gap-1 px-4
          py-1 sm:h-fit sm:flex-nowrap sm:px-8 sm:whitespace-nowrap
        `, minimal && `my-2`)}>
        <div className="mr-auto flex flex-row items-center gap-3 sm:gap-4">
          <LocaleNavLink href={preview ? '/preview' : '/'}>
            <span className={`inline-flex items-center gap-1 align-bottom text-base font-medium text-primary`}>
              <BookMarkedIcon className="mr-1 h-4 w-4" />
              {t('title')}
            </span>
          </LocaleNavLink>
          {preview && <Badge className="hidden sm:block" variant="secondary">{t('badge.preview')}</Badge>}
          {!preview &&
              <Badge variant="outline" className="hidden border-neutral-600 font-normal text-secondary sm:block">
                {t('badge.beta')}
              </Badge>
          }
        </div>

        {!minimal && !preview &&
          <ClientLocaleProvider keys={['DocsSearchBar']}>
              <DocsSearchBar searchFunc={searchWikiServer} />
          </ClientLocaleProvider>
        }

        <div className={`
          ml-auto hidden flex-row flex-wrap items-center justify-end sm:flex sm:flex-nowrap sm:justify-start
        `}>
          <nav className="flex flex-row">
            {preview
              ?
              <>
                <HeaderLink href="/preview">{t('link.home')}</HeaderLink>
                <HeaderLink href="/about">{t('link.about')}</HeaderLink>
              </>
              :
              <>
                <HeaderLink href="/">{t('link.home')}</HeaderLink>
                {!minimal &&
                    <>
                        <HeaderLink href="/browse">{t('link.browse')}</HeaderLink>
                        <HeaderLink href="/about">{t('link.about')}</HeaderLink>
                    </>
                }
              </>
            }
          </nav>

          {!minimal &&
            <ClientLocaleProvider keys={['LanguageSelect']}>
              <LanguageSelect locale={locale} />
            </ClientLocaleProvider>
          }
        </div>

        <div className="flex flex-row items-center gap-2">
          {!minimal && !preview &&
            <ClientLocaleProvider keys={['DocsSearchBar']}>
                <MobileDocsSearch searchFunc={searchWikiServer} />
            </ClientLocaleProvider>
          }

          <MobileNav>
            <nav className="flex flex-col gap-2">
              {preview
                ?
                <>
                  <MobileHeaderLink href="/preview">{t('link.home')}</MobileHeaderLink>
                  <MobileHeaderLink href="/about">{t('link.about')}</MobileHeaderLink>
                </>
                :
                <>
                  <MobileHeaderLink href="/">{t('link.home')}</MobileHeaderLink>
                  {!minimal &&
                    <>
                        <MobileHeaderLink href="/browse">{t('link.browse')}</MobileHeaderLink>
                        <MobileHeaderLink href="/about">{t('link.about')}</MobileHeaderLink>
                    </>
                  }
                </>
              }
              {!minimal &&
                <ClientLocaleProvider keys={['LanguageSelect']}>
                    <LanguageSelect mobile locale={locale} />
                </ClientLocaleProvider>
              }
              <hr />
              <div className="mx-auto mt-2">
                <SocialButtons large />
              </div>
            </nav>
          </MobileNav>
        </div>
      </div>
    </HeaderBase>
  )
}