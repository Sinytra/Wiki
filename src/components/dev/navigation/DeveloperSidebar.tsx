'use client'

import * as React from 'react';
import {BookOpen, PencilRulerIcon, Settings2, UserIcon, WrenchIcon} from 'lucide-react';

import {DevSidebarMainNav} from "@/components/dev/navigation/DevSidebarMainNav";
import {DevSidebarUser} from "@/components/dev/navigation/DevSidebarUser";
import {DevSidebarContextSwitcher} from "@/components/dev/navigation/DevSidebarContextSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu
} from "@repo/ui/components/sidebar";
import {useTranslations} from "next-intl";
import DevSidebarMenuItem from "@/components/dev/navigation/DevSidebarMenuItem";
import {UserProfile, UserRole} from "@repo/shared/types/api/auth";
import usePreventBuggyScrollLock from "@repo/shared/client/usePreventBuggyScrollLock";

interface Props extends React.ComponentProps<typeof Sidebar> {
  profile: UserProfile;
  logoutAction: () => Promise<void>;
}

export function DeveloperSidebar({profile, logoutAction, ...props}: Props) {
  usePreventBuggyScrollLock();
  const t = useTranslations('DeveloperSidebar');

  const teams = [
    {
      name: t('teams.personal'),
      logo: UserIcon
    }
  ];
  const mainEntries = [
    {
      id: 'platform',
      name: t('groups.platform'),
      items: [
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
        }
      ]
    }
  ];

  return (
    <Sidebar variant="floating" className="sticky top-[calc(var(--vp-nav-height))] -ml-[0.7rem] h-[94vh]"
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

        <DevSidebarMainNav groups={mainEntries}/>

        {profile.role === UserRole.ADMIN &&
          <div className="mt-auto px-2">
              <SidebarGroup className="border-destructive-secondary rounded-sm border">
                  <SidebarGroupLabel>
                    {t('groups.admin')}
                  </SidebarGroupLabel>
                  <SidebarMenu>
                      <DevSidebarMenuItem url="/admin" matcher={/^\/admin?$/} icon={WrenchIcon} title={t('nav.admin')} />
                  </SidebarMenu>
              </SidebarGroup>
          </div>
        }
      </SidebarContent>
      <SidebarFooter>
        <DevSidebarUser profile={profile} logoutAction={logoutAction}/>
      </SidebarFooter>
    </Sidebar>
  )
}
