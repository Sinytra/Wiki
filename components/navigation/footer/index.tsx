import React from "react";
import localPreview from "@/lib/docs/localPreview";
import {cn} from "@/lib/utils";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import Link from "next/link";
import {useTranslations} from "next-intl";

function Copyright({ center }: { center: boolean }) {
  const t = useTranslations('NavigationFooter');

  return <>
    <div className={cn("flex flex-col items-center md:basis-96", !center && 'md:items-start')}>
      <span className="font-medium text-foreground">
        📖 {t('title')}
      </span>
      <p className="mt-6 text-sm">
        © {new Date().getFullYear()} The Sinytra Project.
      </p>
    </div>
  </>
}

function LinkEntry({title, href, component: LinkComponent = LocaleNavLink}: { title: string, href: string, component?: any }) {
  return <>
    <ul>
      <li>
        <LinkComponent
          className="hover:text-secondary-foreground transition-colors rounded-md py-0.5 text-sm text-muted-foreground outline-none"
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
      <p className="mb-2 text-sm text-foreground font-medium">{title}</p>

      {children}
    </div>
  </>
}

function NavigationColumns() {
  const t = useTranslations('NavigationFooter');

  return (
    <div className="grid w-full ml-auto grid-cols-4 gap-8 px-8">
      <LinkColumn title={t('links.navigation.title')}>
        <LinkEntry title={t('links.navigation.home')} href="/"/>
        <LinkEntry title={t('links.navigation.browse')} href="/browse"/>
        <LinkEntry title={t('links.navigation.dev')} href="/dev"/>
      </LinkColumn>

      <LinkColumn title={t('links.links.title')}>
        <LinkEntry title="Discord" href="https://discord.sinytra.org"/>
        <LinkEntry title="GitHub" href="https://github.com/Sinytra"/>
        <LinkEntry title="OpenCollective" href="https://opencollective.com/sinytra"/>
      </LinkColumn>

      <LinkColumn title={t('links.resources.title')}>
        <LinkEntry title={t('links.resources.blog')} href="/blog" component={Link}/>
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
  const isPreview = localPreview.isEnabled();

  return (
    <footer
      className="w-full bg-muted pt-12 pb-6 mx-auto flex flex-col justify-center items-center border-t border-border">
      <div className="px-8 w-full max-w-[90rem] text-muted-foreground flex flex-col gap-8">
        <div
          className={cn("flex flex-wrap-reverse md:flex-nowrap md:flex-row w-full justify-center gap-y-8", !isPreview && 'md:justify-between')}>
          <Copyright center={isPreview}/>

          { !isPreview && <NavigationColumns /> }
        </div>
        <div className="text-center">
          <span className="text-xs text-muted-foreground">NOT AN OFFICIAL MINECRAFT WEBSITE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</span>
        </div>
      </div>
    </footer>
  )
}
