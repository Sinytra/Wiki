'use client'

import {BookMarkedIcon, HomeIcon, PencilRulerIcon, ShieldIcon} from "lucide-react";
import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";

export default function MetaDocsNavigation() {
  return (
    <CollapsibleDocsTreeBase title="Navigation">
      <div className="flex flex-col gap-2 my-2">
        <SidebarNavLink href="/about" icon={HomeIcon}>
          About
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/usage" icon={BookMarkedIcon}>
          User guide
        </SidebarNavLink>
        <SidebarNavLink href="/about/devs" icon={PencilRulerIcon}>
          Developers
        </SidebarNavLink>

        <hr/>

        <SidebarNavLink href="/about/privacy" icon={ShieldIcon}>
          Privacy policy
        </SidebarNavLink>
      </div>
    </CollapsibleDocsTreeBase>
  )
}