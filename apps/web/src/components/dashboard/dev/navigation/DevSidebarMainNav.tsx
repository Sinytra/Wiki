'use client'

import {Collapsible,} from "@repo/ui/components/collapsible"
import {SidebarGroup, SidebarGroupLabel, SidebarMenu,} from "@repo/ui/components/sidebar"
import DevSidebarMenuItem, {Props as DevSidebarMenuItemProps} from "@/components/dashboard/dev/navigation/DevSidebarMenuItem";
import * as React from "react";
import {usePathname} from "@/lib/locales/routing";

interface Group {
  id: string;
  name: string;
  items: DevSidebarMenuItemProps[]
}

interface Props {
  groups: Group[]
}

export function DevSidebarMainNav({groups}: Props) {
  const pathname = usePathname();

  function isActive(item: DevSidebarMenuItemProps) {
    return pathname === item.url;
  }

  return (
    <div>
      {...groups.map(group => (
        <SidebarGroup key={group.id}>
          <SidebarGroupLabel>
            {group.name}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
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
      ))}
    </div>
  )
}
