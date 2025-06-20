'use client'

import {
  BookOpenIcon,
  HelpCircleIcon,
  HomeIcon,
  LockKeyholeIcon,
  PencilRulerIcon,
  ScrollTextIcon,
  ShieldIcon
} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import * as React from "react";
import {useTranslations} from "next-intl";

export default function MetaDocsNavigation({docsOnly}: { docsOnly?: boolean }) {
  const t = useTranslations('MetaDocsNavigation');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <div className="my-2 flex flex-col gap-2">
        <SidebarNavLink href="/about/overview" icon={HomeIcon}>
          {t('about')}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/devs" icon={PencilRulerIcon} className={`
          flex w-full flex-row items-center justify-between
        `}>
          {t('devs')}
          <BookOpenIcon className="h-4 w-4"/>
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/help" icon={HelpCircleIcon}>
          {t('help')}
        </SidebarNavLink>
        {!docsOnly && <>
            <SidebarNavLink href="/about/tos" icon={ScrollTextIcon}>
              {t('tos')}
            </SidebarNavLink>
            <SidebarNavLink href="/about/privacy" icon={LockKeyholeIcon}>
              {t('privacy')}
            </SidebarNavLink>
            <SidebarNavLink href="/about/security" icon={ShieldIcon}>
              {t('security')}
            </SidebarNavLink>
        </>}
      </div>
    </CollapsibleDocsTreeBase>
  )
}