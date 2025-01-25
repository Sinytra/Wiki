'use client'

import * as React from 'react';
import {BookOpen, PencilRulerIcon, Settings2, UserIcon} from 'lucide-react';

import {DevSidebarMainNav} from "@/components/dev/DevSidebarMainNav";
import {DevSidebarUser} from "@/components/dev/DevSidebarUser";
import {DevSidebarContextSwitcher} from "@/components/dev/DevSidebarContextSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {GitHubUserProfile} from "@/lib/service/remoteServiceApi";
import clientUtil from "@/lib/util/clientUtil";
import {useTranslations} from "next-intl";

interface Props extends React.ComponentProps<typeof Sidebar> {
  profile: GitHubUserProfile;
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
      url: "#",
      icon: Settings2,
      disabled: true
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
            <SidebarMenuItem>
              <SidebarMenuButton isActive asChild>
                <a href="#">
                  <PencilRulerIcon/>
                  <span>
                    {t('nav.projects')}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
