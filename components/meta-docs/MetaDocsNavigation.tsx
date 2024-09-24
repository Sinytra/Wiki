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

export default function MetaDocsNavigation({ messages }: { messages: any }) {
  return (
    <CollapsibleDocsTreeBase title={messages['title']}>
      <div className="flex flex-col gap-2 my-2">
        <SidebarNavLink href="/about" icon={HomeIcon}>
          {messages['about']}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/devs" icon={PencilRulerIcon}>
          {messages['devs']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/format" icon={TypeIcon}>
          {messages['format']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/publishing" icon={UploadIcon}>
          {messages['publishing']}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/help" icon={HelpCircleIcon}>
          {messages['help']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/tos" icon={ScrollTextIcon}>
          {messages['tos']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/privacy" icon={LockKeyholeIcon}>
          {messages['privacy']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/security" icon={ShieldIcon}>
          {messages['security']}
        </SidebarNavLink>
      </div>
    </CollapsibleDocsTreeBase>
  )
}