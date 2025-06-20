'use client'

import * as React from 'react';
import {
  DatabaseIcon,
  FlagIcon,
  HistoryIcon,
  HouseIcon,
  PencilRulerIcon,
  ScrollTextIcon,
  ServerCogIcon,
  SettingsIcon,
  Undo2Icon,
  UsersIcon
} from 'lucide-react';

import {DevSidebarMainNav} from "@/components/dev/navigation/DevSidebarMainNav";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu} from "@repo/ui/components/sidebar";
import {useTranslations} from "next-intl";
import DevSidebarMenuItem from "@/components/dev/navigation/DevSidebarMenuItem";
import {UserProfile} from "@repo/shared/types/api/auth";
import usePreventBuggyScrollLock from "@repo/shared/client/usePreventBuggyScrollLock";

interface Props extends React.ComponentProps<typeof Sidebar> {
  profile: UserProfile;
}

function AdminSidebarHeader() {
  return (
    <div className={`
      border-destructive-secondary flex w-full flex-col items-center justify-center gap-4 rounded-sm border py-3
    `}>
      <div>
        <ServerCogIcon width={32} height={32} />
      </div>
      <span className="text-lg">
        Administrator area
      </span>
    </div>
  )
}

export function AdminSidebar({profile, ...props}: Props) {
  usePreventBuggyScrollLock();
  const t = useTranslations('AdminSidebar');

  const mainEntries = [
    {
      id: 'home',
      name: t('groups.home'),
      items: [
        {
          title: t('nav.home'),
          url: "/admin",
          icon: HouseIcon
        }
      ]
    },
    {
      id: 'system',
      name: t('groups.system'),
      items: [
        {
          title: t('nav.data_imports'),
          url: "/admin/data_imports",
          icon: DatabaseIcon
        },
        {
          title: t('nav.config'),
          url: "/admin/config",
          icon: SettingsIcon,
          disabled: true
        },
        {
          title: t('nav.logs'),
          url: "/admin/logs",
          icon: ScrollTextIcon,
          disabled: true
        }
      ]
    },
    {
      id: 'data',
      name: t('groups.data'),
      items: [
        {
          title: t('nav.projects'),
          url: "/admin/projects",
          icon: PencilRulerIcon,
          disabled: true
        },
        {
          title: t('nav.users'),
          url: "/admin/users",
          icon: UsersIcon,
          disabled: true
        }
      ]
    },
    {
      id: 'moderation',
      name: t('groups.moderation'),
      items: [
        {
          title: t('nav.reports'),
          url: "/admin/reports",
          icon: FlagIcon,
          disabled: true
        },
        {
          title: t('nav.audit_log'),
          url: "/admin/audit_log",
          icon: HistoryIcon,
          disabled: true
        }
      ]
    }
  ];

  return (
    <Sidebar variant="floating" className="sticky top-[calc(var(--vp-nav-height))] -ml-[0.7rem] h-[94vh]"
             collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <AdminSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <DevSidebarMainNav groups={mainEntries}/>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <DevSidebarMenuItem url="/dev" icon={Undo2Icon} title={t('nav.return')}/>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
