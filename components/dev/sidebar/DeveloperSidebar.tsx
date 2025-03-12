'use client'

import * as React from 'react';
import {BookOpen, PencilRulerIcon, Settings2, UserIcon} from 'lucide-react';

import {DevSidebarMainNav} from "@/components/dev/sidebar/DevSidebarMainNav";
import {DevSidebarUser} from "@/components/dev/sidebar/DevSidebarUser";
import {DevSidebarContextSwitcher} from "@/components/dev/sidebar/DevSidebarContextSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu
} from "@/components/ui/sidebar";
import clientUtil from "@/lib/util/clientUtil";
import {useTranslations} from "next-intl";
import {UserProfile} from "@/lib/service/remoteServiceApi";
import DevSidebarMenuItem from "@/components/dev/sidebar/DevSidebarMenuItem";

interface Props extends React.ComponentProps<typeof Sidebar> {
  profile: UserProfile;
  logoutAction: () => Promise<void>;
}

export function DeveloperSidebar({profile, logoutAction, ...props}: Props) {
  clientUtil.usePreventBuggyScrollLock();
  const t = useTranslations('DeveloperSidebar');

  const teams = [
    {
      name: t('teams.personal'),
      logo: UserIcon
    }
  ];
  const mainEntries = [
    {
      title: t('nav.documentation'),
      url: "/about/devs",
      icon: BookOpen,
      external: true
    },
    {
      title: t('nav.settings'),
      url: "/dev/settings",
      icon: Settings2
    },
  ];

  return (
    <Sidebar variant="floating" className="sticky -ml-[0.7rem] h-[94vh] top-[calc(var(--vp-nav-height))]"
             collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <DevSidebarContextSwitcher teams={teams}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            {t('groups.projects')}
          </SidebarGroupLabel>
          <SidebarMenu>
            <DevSidebarMenuItem url="/dev" matcher={/^\/dev(\/project\/.*)?$/} icon={PencilRulerIcon} title={t('nav.projects')} />
          </SidebarMenu>
        </SidebarGroup>

        <DevSidebarMainNav items={mainEntries}/>
      </SidebarContent>
      <SidebarFooter>
        <DevSidebarUser profile={profile} logoutAction={logoutAction}/>
      </SidebarFooter>
    </Sidebar>
  )
}
