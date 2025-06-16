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

export default function MetaDocsNavigation({messages, docsOnly}: { messages: any, docsOnly?: boolean }) {
  return (
    <CollapsibleDocsTreeBase title={messages['title']}>
      <div className="my-2 flex flex-col gap-2">
        <SidebarNavLink href="/about/overview" icon={HomeIcon}>
          {messages['about']}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/devs" icon={PencilRulerIcon} className={`
          flex w-full flex-row items-center justify-between
        `}>
          {messages['devs']}
          <BookOpenIcon className="h-4 w-4"/>
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/help" icon={HelpCircleIcon}>
          {messages['help']}
        </SidebarNavLink>
        {!docsOnly && <>
            <SidebarNavLink href="/about/tos" icon={ScrollTextIcon}>
              {messages['tos']}
            </SidebarNavLink>
            <SidebarNavLink href="/about/privacy" icon={LockKeyholeIcon}>
              {messages['privacy']}
            </SidebarNavLink>
            <SidebarNavLink href="/about/security" icon={ShieldIcon}>
              {messages['security']}
            </SidebarNavLink>
        </>}
      </div>
    </CollapsibleDocsTreeBase>
  )
}