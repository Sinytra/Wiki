"use client"

import {ExternalLinkIcon, type LucideIcon} from "lucide-react"

import {Collapsible,} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useTranslations} from "next-intl";
import {Link} from "@/lib/locales/routing";

interface Props {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    external?: boolean;
    disabled?: boolean;
  }[]
}

export function DevSidebarMainNav({items}: Props) {
  const t = useTranslations('DeveloperSidebar');

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
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <Link href={item.url} target={item.external ? '_blank' : undefined}>
                <SidebarMenuButton disabled={item.disabled} tooltip={item.title}>
                  {item.icon && <item.icon/>}
                  <span>{item.title}</span>
                  {item.external && <ExternalLinkIcon className="ml-auto w-4 h-4" />}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
