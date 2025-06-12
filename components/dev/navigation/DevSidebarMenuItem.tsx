'use client'

import {Link, usePathname} from "@/lib/locales/routing";
import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {ExternalLinkIcon, type LucideIcon} from "lucide-react";
import ConnectionIndicator from "@/components/util/ConnectionIndicator";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";

export interface Props {
  title: string;
  url: string;
  icon?: LucideIcon;
  external?: boolean;
  disabled?: boolean;
  live?: boolean;
  extra?: ReactNode;
  matcher?: RegExp;
}

export default function DevSidebarMenuItem({title, url, icon: Icon, external, disabled, matcher, live, extra}: Props) {
  const pathname = usePathname();

  const isActive = matcher ? matcher.test(pathname) : pathname === url;

  return (
    <SidebarMenuItem>
      <Link href={url} target={external ? '_blank' : undefined} className={cn(disabled && 'pointer-events-none')}>
        <SidebarMenuButton isActive={isActive} disabled={disabled} tooltip={title}>
          {Icon && <Icon/>}
          <span>{title}</span>
          {external && <ExternalLinkIcon className="ml-auto h-4 w-4" />}
          {live && <ConnectionIndicator className="ml-auto" /> }
          {extra}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}