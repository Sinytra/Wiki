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
  matcher?: RegExp;
}

export default function DevSidebarMenuItem({title, url, icon: Icon, external, disabled, matcher}: Props) {
  const pathname = usePathname();

  const isActive = matcher ? matcher.test(pathname) : pathname === url;

  return (
    <SidebarMenuItem>
      <Link href={url} target={external ? '_blank' : undefined}>
        <SidebarMenuButton isActive={isActive} disabled={disabled} tooltip={title}>
          {Icon && <Icon/>}
          <span>{title}</span>
          {external && <ExternalLinkIcon className="ml-auto w-4 h-4" />}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}