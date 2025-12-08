'use client'

import * as React from 'react';
import {useContext} from 'react';
import {
  ActivityIcon, AlertCircleIcon,
  ArrowLeftIcon,
  BoxIcon,
  GitBranchIcon, HardDriveIcon,
  LayoutGridIcon,
  PencilRulerIcon,
  SettingsIcon,
  TagsIcon, TriangleAlertIcon,
  UsersIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu
} from "@repo/ui/components/sidebar";
import {useTranslations} from "next-intl";
import DevSidebarMenuItem from "@/components/dashboard/dev/navigation/DevSidebarMenuItem";
import {PlatformProject} from "@repo/shared/platforms";
import {DevProjectSidebarContext} from "@/components/dashboard/dev/navigation/DevProjectSidebarContextProvider";
import {DevProject} from "@repo/shared/types/service";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

interface Props extends React.ComponentProps<typeof Sidebar> {
  project: DevProject;
  platformProject: PlatformProject;
}

function SidebarProjectHeader({project, platformProject}: { project: DevProject; platformProject: PlatformProject }) {
  // TODO Localize
  return (
    <div className="space-y-3 p-1">
      <LocaleNavLink href="/dev"
            className="flex flex-row items-center gap-2 pb-1 text-sm text-secondary underline-offset-4 hover:underline">
        <ArrowLeftIcon className="size-4"/>
        <span>Back</span>
      </LocaleNavLink>
      <h3 className="text-sm text-primary-alt/70">
        Project settings
      </h3>
      <div className="flex flex-row items-center gap-2">
        <ImageWithFallback width={32} height={32} src={platformProject.icon_url} alt="icon" className="rounded-sm"/>
        <span className="text-sm font-medium text-wrap text-primary">{project.name}</span>
      </div>
    </div>
  );
}

export default function DevProjectSidebar({project, platformProject, ...props}: Props) {
  const t = useTranslations('DevProjectSidebar');

  const baseUrl = `/dev/project/${project.id}`;
  const {connected} = useContext(DevProjectSidebarContext)!;
  const disableContents = !project.has_active_deployment;

  return (
    <Sidebar variant="floating" className="sticky top-[calc(var(--vp-nav-height))] -ml-[0.7rem] h-[94vh]"
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
            <DevSidebarMenuItem
              url={`${baseUrl}/deployments`}
              icon={HardDriveIcon}
              title={t('nav.deployments')}
              matcher={RegExp(`^${baseUrl}/deployments(/.*)?$`)}
              live={connected}
              extra={project.has_failing_deployment &&
                <div className="ml-auto flex items-center gap-1 align-bottom text-sm text-destructive">
                  <AlertCircleIcon className="size-4" />
                </div>
              }
            />
            <DevSidebarMenuItem
              url={`${baseUrl}/health`}
              icon={ActivityIcon}
              title={t('nav.health')}
              extra={project.issue_stats && (
                project.issue_stats.error > 0 ?
                  <div className="ml-auto flex items-center gap-1 align-bottom text-sm text-destructive">
                      <AlertCircleIcon className="size-4" />
                  </div>
                 :
                  project.issue_stats.warning > 0 &&
                  <div className="ml-auto flex items-center gap-1 align-bottom text-sm text-warning">
                      <TriangleAlertIcon className="size-4" />
                  </div>
              )}
            />
            <DevSidebarMenuItem url={`${baseUrl}/members`} icon={UsersIcon} title={t('nav.members')}/>
            <DevSidebarMenuItem url={`${baseUrl}/settings`} icon={SettingsIcon} title={t('nav.settings')}/>
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
                                matcher={RegExp(`^${baseUrl}/content/tags(/.*)?$`)}/>
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
