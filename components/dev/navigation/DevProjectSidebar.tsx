'use client'

import * as React from 'react';
import {useContext} from 'react';
import {
  ActivityIcon,
  ArrowLeftIcon,
  BoxIcon,
  GitBranchIcon,
  LayoutGridIcon,
  PencilRulerIcon,
  SettingsIcon,
  TagsIcon,
  UsersIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu
} from "@/components/ui/sidebar";
import {useTranslations} from "next-intl";
import DevSidebarMenuItem from "@/components/dev/navigation/DevSidebarMenuItem";
import {DevProject} from "@/lib/service";
import {PlatformProject} from "@/lib/platforms";
import {Link} from "@/lib/locales/routing";
import {DevProjectSidebarContext} from "@/components/dev/navigation/DevProjectSidebarContextProvider";
import {ProjectStatus} from "@/lib/types/serviceTypes";

interface Props extends React.ComponentProps<typeof Sidebar> {
  project: DevProject;
  platformProject: PlatformProject;
}

function SidebarProjectHeader({project, platformProject}: { project: DevProject; platformProject: PlatformProject }) {
  // TODO Fallback
  return (
    <div className="p-1 space-y-3">
      <Link href="/dev"
            className="flex flex-row gap-2 items-center text-sm text-secondary hover:underline underline-offset-4 pb-1">
        <ArrowLeftIcon className="size-4"/>
        <span>Back</span>
      </Link>
      <h3 className="text-primary-alt/70 text-sm">
        Project settings
      </h3>
      <div className="flex flex-row gap-2 items-center">
        <img src={platformProject.icon_url} alt="icon" className="rounded-sm size-8"/>
        <span className="text-primary text-sm text-wrap font-medium">{project.name}</span>
      </div>
    </div>
  );
}

export default function DevProjectSidebar({project, platformProject, ...props}: Props) {
  const t = useTranslations('DevProjectSidebar');

  const baseUrl = `/dev/project/${project.id}`;
  const {connected} = useContext(DevProjectSidebarContext)!;
  const disableContents = project.status !== ProjectStatus.LOADED;

  return (
    <Sidebar variant="floating" className="sticky -ml-[0.7rem] h-[94vh] top-[calc(var(--vp-nav-height))]"
             collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarProjectHeader project={project} platformProject={platformProject}/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            {t('groups.project')}
          </SidebarGroupLabel>
          <SidebarMenu>
            <DevSidebarMenuItem url={baseUrl} icon={PencilRulerIcon} title={t('nav.home')}/>
            <DevSidebarMenuItem url={`${baseUrl}/settings`} icon={SettingsIcon} title={t('nav.settings')}/>
            <DevSidebarMenuItem url={`${baseUrl}/health`} icon={ActivityIcon} title={t('nav.health')} live={connected}/>
            <DevSidebarMenuItem url={`${baseUrl}/members`} icon={UsersIcon} title={t('nav.members')}/>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            {t('groups.content')}
          </SidebarGroupLabel>
          <SidebarMenu>
            <DevSidebarMenuItem url={`${baseUrl}/versions`} icon={GitBranchIcon} title={t('nav.versions')} disabled={disableContents}/>
            <DevSidebarMenuItem url={`${baseUrl}/content/items`} icon={BoxIcon} title={t('nav.content')} disabled={disableContents}/>
            <DevSidebarMenuItem url={`${baseUrl}/content/tags`} icon={TagsIcon} title={t('nav.tags')}
                                disabled={disableContents}
                                matcher={RegExp(`^${baseUrl}\/content\/tags(\/.*)?$`)}/>
            <DevSidebarMenuItem url={`${baseUrl}/content/recipes`} icon={LayoutGridIcon} title={t('nav.recipes')} disabled={disableContents}/>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/*<SidebarFooter>*/}
      {/*  <DevSidebarUser profile={profile} logoutAction={logoutAction}/>*/}
      {/*</SidebarFooter>*/}
    </Sidebar>
  )
}
