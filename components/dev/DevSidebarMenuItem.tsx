'use client'

import {Link, usePathname} from "@/lib/locales/routing";
import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {ExternalLinkIcon, type LucideIcon} from "lucide-react";

export interface Props {
  title: string;
  url: string;
  icon?: LucideIcon;
  external?: boolean;
  disabled?: boolean;
}

export default function DevSidebarMenuItem({title, url, icon: Icon, external, disabled}: Props) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <Link href={url} target={external ? '_blank' : undefined}>
        <SidebarMenuButton isActive={pathname === url} disabled={disabled} tooltip={title}>
          {Icon && <Icon/>}
          <span>{title}</span>
          {external && <ExternalLinkIcon className="ml-auto w-4 h-4" />}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}