'use client'

import {usePathname} from "@/lib/locales/routing";
import {SidebarMenuButton, SidebarMenuItem} from "@repo/ui/components/sidebar";
import {ExternalLinkIcon, type LucideIcon} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";
import {ReactNode} from "react";
import ConnectionIndicator from "@repo/ui/components/indicator/ConnectionIndicator";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

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
      <LocaleNavLink href={url} target={external ? '_blank' : undefined} className={cn(disabled && 'pointer-events-none')}>
        <SidebarMenuButton isActive={isActive} disabled={disabled} tooltip={title}>
          {Icon && <Icon/>}
          <span>{title}</span>
          {external && <ExternalLinkIcon className="ml-auto h-4 w-4" />}
          {live && <ConnectionIndicator className="ml-auto" /> }
          {!live && extra}
        </SidebarMenuButton>
      </LocaleNavLink>
    </SidebarMenuItem>
  );
}