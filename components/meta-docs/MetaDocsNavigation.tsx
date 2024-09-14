'use client'

import {
  HelpCircleIcon,
  HomeIcon,
  LockKeyholeIcon,
  PencilRulerIcon,
  ScrollTextIcon,
  ShieldIcon,
  TypeIcon,
  UploadIcon
} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";

export default function MetaDocsNavigation() {
  return (
    <CollapsibleDocsTreeBase title="Navigation">
      <div className="flex flex-col gap-2 my-2">
        <SidebarNavLink href="/about" icon={HomeIcon}>
          About
        </SidebarNavLink>

        {/*<hr/>*/}
        {/*<SidebarNavLink href="/about/i18n" icon={LanguagesIcon}>*/}
        {/*  Help us translate!*/}
        {/*</SidebarNavLink>*/}

        <hr/>

        <SidebarNavLink href="/about/devs" icon={PencilRulerIcon}>
          Developers
        </SidebarNavLink>
        <SidebarNavLink href="/about/format" icon={TypeIcon}>
          Format
        </SidebarNavLink>
        <SidebarNavLink href="/about/publishing" icon={UploadIcon}>
          Publishing
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/help" icon={HelpCircleIcon}>
          Get help
        </SidebarNavLink>
        <SidebarNavLink href="/about/tos" icon={ScrollTextIcon}>
          Terms of Use
        </SidebarNavLink>
        <SidebarNavLink href="/about/privacy" icon={LockKeyholeIcon}>
          Privacy Policy
        </SidebarNavLink>
        <SidebarNavLink href="/about/security" icon={ShieldIcon}>
          Security Notice
        </SidebarNavLink>
      </div>
    </CollapsibleDocsTreeBase>
  )
}