'use client'

import {FileCogIcon, FolderOpenIcon, HomeIcon, ShapesIcon, TypeIcon, Undo2Icon, UploadIcon} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import * as React from "react";
import {useTranslations} from "next-intl";

export default function MetaDevDocsNavigation() {
  const t = useTranslations('MetaDevDocsNavigation');

  return (
    <CollapsibleDocsTreeBase title={t('title')}>
      <div className="my-2 flex flex-col gap-2">
        <SidebarNavLink href="/about/overview" icon={Undo2Icon}>
          {t('back')}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/devs" icon={HomeIcon}>
          {t('start')}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/structure" icon={FolderOpenIcon}>
          {t('structure')}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/config" icon={FileCogIcon}>
          {t('config')}
        </SidebarNavLink>

        <SidebarNavLink href="/about/devs/format" icon={TypeIcon}>
          {t('format')}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/components" icon={ShapesIcon} nested>
          {t('components')}
        </SidebarNavLink>

        <SidebarNavLink href="/about/devs/publishing" icon={UploadIcon}>
          {t('publishing')}
        </SidebarNavLink>
      </div>
    </CollapsibleDocsTreeBase>
  )
}