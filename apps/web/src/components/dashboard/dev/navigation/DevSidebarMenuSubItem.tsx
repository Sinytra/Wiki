'use client'

import {usePathname} from "@/lib/locales/routing";
import {SidebarMenuSubButton, SidebarMenuSubItem} from "@repo/ui/components/sidebar";
import {ExternalLinkIcon} from "lucide-react";
import {ReactNode} from "react";
import ConnectionIndicator from "@repo/ui/components/indicator/ConnectionIndicator";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export interface Props {
  title: string;
  url: string;
  external?: boolean;
  live?: boolean;
  extra?: ReactNode;
  matcher?: RegExp;
}

export default function DevSidebarMenuSubItem({title, url, external, matcher, live, extra}: Props) {
  const pathname = usePathname();

  const isActive = matcher ? matcher.test(pathname) : pathname === url;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <LocaleNavLink href={url} target={external ? '_blank' : undefined}>
          <span>{title}</span>
          {external && <ExternalLinkIcon className="ml-auto h-4 w-4"/>}
          {live && <ConnectionIndicator className="ml-auto"/>}
          {!live && extra}
        </LocaleNavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}