'use client'

import {Collapsible,} from "@/components/ui/collapsible"
import {SidebarGroup, SidebarGroupLabel, SidebarMenu,} from "@/components/ui/sidebar"
import {useTranslations} from "next-intl";
import DevSidebarMenuItem, {Props as DevSidebarMenuItemProps} from "@/components/dev/navigation/DevSidebarMenuItem";
import * as React from "react";
import {usePathname} from "@/lib/locales/routing";

interface Props {
  items: DevSidebarMenuItemProps[]
}

export function DevSidebarMainNav({items}: Props) {
  const t = useTranslations('DeveloperSidebar');
  const pathname = usePathname();

  function isActive(item: DevSidebarMenuItemProps) {
    return pathname === item.url;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {t('groups.platform')}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive(item)}
            className="group/collapsible"
          >
            <DevSidebarMenuItem {...item} />
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
