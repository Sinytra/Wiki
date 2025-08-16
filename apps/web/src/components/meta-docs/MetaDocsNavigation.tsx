'use client'

import {HelpCircleIcon, HomeIcon, LockKeyholeIcon, PencilRulerIcon, ScrollTextIcon, ShieldIcon} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import * as React from "react";
import {useTranslations} from "next-intl";
import {WIKI_DOCS_URL} from "@repo/shared/constants";

export default function MetaDocsNavigation({docsOnly}: { docsOnly?: boolean }) {
  const t = useTranslations('MetaDocsNavigation');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <div className="my-2 flex flex-col gap-2">
        <SidebarNavLink href="/about" icon={HomeIcon}>
          {t('about')}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href={WIKI_DOCS_URL} icon={PencilRulerIcon}>
          {t('devs')}
        </SidebarNavLink>
        {/* TODO Complete gallery or move it to the docs website */}
        {/*<SidebarNavLink href="/about/components" icon={ShapesIcon}>*/}
        {/*  {t('components')}*/}
        {/*</SidebarNavLink>*/}

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