'use client'

import {
  FileCogIcon,
  FolderOpenIcon,
  HomeIcon, ShapesIcon,
  TypeIcon,
  Undo2Icon,
  UploadIcon,
  UsersIcon
} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import * as React from "react";

export default function MetaDevDocsNavigation({messages}: { messages: any }) {
  return (
    <CollapsibleDocsTreeBase title={messages['title']}>
      <div className="flex flex-col gap-2 my-2">
        <SidebarNavLink href="/about/overview" icon={Undo2Icon}>
          {messages['back']}
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/devs" icon={HomeIcon}>
          {messages['start']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/structure" icon={FolderOpenIcon}>
          {messages['structure']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/config" icon={FileCogIcon}>
          {messages['config']}
        </SidebarNavLink>

        <SidebarNavLink href="/about/devs/format" icon={TypeIcon}>
          {messages['format']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/components" icon={ShapesIcon} nested>
          {messages['components']}
        </SidebarNavLink>

        <SidebarNavLink href="/about/devs/publishing" icon={UploadIcon}>
          {messages['publishing']}
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs/community" icon={UsersIcon}>
          {messages['community']}
        </SidebarNavLink>
      </div>
    </CollapsibleDocsTreeBase>
  )
}