'use client'

import * as React from 'react';
import {BookOpen, PencilRulerIcon, Settings2, UserIcon} from 'lucide-react';

import {NavMain} from "@/components/dev/new/NavMain";
import {NavUser} from "@/components/dev/new/NavUser";
import {ContextSwitcher} from "@/components/dev/new/ContextSwitcher";
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

const data = {
  teams: [
    {
      name: 'Personal',
      logo: UserIcon
    }
  ],
  navMain: [
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2
    },
  ],
  projects: [
    {
      name: "Projects",
      url: "#",
      icon: PencilRulerIcon,
    }
  ],
}

interface Props extends React.ComponentProps<typeof Sidebar> {
  profile: GitHubUserProfile;
  logoutAction: () => Promise<void>;
}

export function AppSidebar({profile, logoutAction, ...props}: Props) {
  clientUtil.usePreventBuggyScrollLock();

  return (
    <Sidebar variant="floating" className="sticky -ml-[0.7rem] h-[94vh] top-[calc(var(--vp-nav-height))]" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ContextSwitcher teams={data.teams}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            Projects
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="Projects">
              <SidebarMenuButton isActive asChild>
                <a href="#">
                  <PencilRulerIcon />
                  <span>
                    Projects
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={data.navMain}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={profile} logoutAction={logoutAction}/>
      </SidebarFooter>
    </Sidebar>
  )
}
