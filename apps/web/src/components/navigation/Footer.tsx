import React from "react";
import {cn} from "@repo/ui/lib/utils";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {useTranslations} from "next-intl";
import {BookMarkedIcon} from "lucide-react";
import env from "@repo/shared/env";
import ManageCookiesButton from "@/components/cookies/ManageCookiesButton";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {NavLink} from "@/components/navigation/link/NavLink";

function Copyright({ center }: { center: boolean }) {
  const t = useTranslations('NavigationFooter');

  return <>
    <div className={cn("flex flex-col items-center md:basis-96", !center && 'md:items-start')}>
      <span className="inline-flex items-center font-medium text-primary">
        <BookMarkedIcon className="mr-2 h-4 w-4" />
        {t('title')}
      </span>
      <p className="mt-6 text-sm">
        © {new Date().getFullYear()} The Sinytra Project.
      </p>
      <div className="mt-auto pt-3 font-normal! text-secondary">
        <ClientLocaleProvider keys={['ManageCookiesButton']}>
          <ManageCookiesButton />
        </ClientLocaleProvider>
      </div>
    </div>
  </>
}

function LinkEntry({title, href, component: LinkComponent = LocaleNavLink}: { title: string, href: string, component?: any }) {
  return <>
    <ul>
      <li>
        <LinkComponent
          className="rounded-md py-0.5 text-sm text-secondary outline-hidden transition-colors hover:text-secondary-alt"
          href={href}>
          {title}
        </LinkComponent>
      </li>
    </ul>
  </>
}

function LinkColumn({title, className, children}: { title: string, className?: string, children: React.ReactNode }) {
  return <>
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="mb-2 text-sm font-medium text-primary">{title}</p>

      {children}
    </div>
  </>
}

function NavigationColumns() {
  const t = useTranslations('NavigationFooter');

  return (
    <div className="ml-auto grid w-full grid-cols-4 gap-8 sm:px-8">
      <LinkColumn title={t('links.navigation.title')}>
        <LinkEntry title={t('links.navigation.home')} href="/"/>
        <LinkEntry title={t('links.navigation.browse')} href="/browse"/>
        <LinkEntry title={t('links.navigation.dev')} href="/dev"/>
      </LinkColumn>

      <LinkColumn title={t('links.links.title')}>
        <LinkEntry title="Discord" href="https://discord.sinytra.org"/>
        <LinkEntry title="GitHub" href="https://github.com/Sinytra"/>
        <LinkEntry title="Donate" href="https://opencollective.com/sinytra"/>
      </LinkColumn>

      <LinkColumn title={t('links.resources.title')}>
        <LinkEntry title={t('links.resources.blog')} href="/blog" component={NavLink}/>
        <LinkEntry title={t('links.resources.status')} href="https://status.moddedmc.org"/>
        <LinkEntry title={t('links.resources.translate')} href="https://crowdin.com/project/sinytra-wiki"/>
      </LinkColumn>

      <LinkColumn title={t('links.about.title')}>
        <LinkEntry title={t('links.about.tos')} href="/about/tos"/>
        <LinkEntry title={t('links.about.privacy')} href="/about/privacy"/>
        <LinkEntry title={t('links.about.contact')} href="/about/help"/>
      </LinkColumn>
    </div>
  );
}

export default function Footer() {
  const isPreview = env.isPreview();

  return (
    <footer
      className={`
        mx-auto flex w-full flex-col items-center justify-center border-t border-tertiary bg-primary-alt pt-10 pb-6
        sm:pt-12
      `}
    >
      <div className="flex w-full max-w-[90rem] flex-col gap-8 px-8 text-secondary">
        <div
          className={cn(
            "flex w-full flex-wrap justify-center gap-y-10 sm:gap-y-8 md:flex-row md:flex-nowrap",
            !isPreview && 'md:justify-between'
          )}
        >
          <Copyright center={isPreview} />

          { !isPreview && <NavigationColumns /> }
        </div>
        <div className="text-center">
          <span className="text-xs text-secondary">
            NOT AN OFFICIAL MINECRAFT WEBSITE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
          </span>
        </div>
      </div>
    </footer>
  )
}
