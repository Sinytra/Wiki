import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@repo/platforms";
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";
import {
  AlertCircleIcon,
  CheckIcon,
  ClockIcon,
  CloudyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  HardDriveIcon,
  HelpCircleIcon,
  InfoIcon,
  LoaderCircleIcon,
  LockIcon,
  XIcon
} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Button} from "@repo/ui/components/button";
import {format} from "date-fns";
import {ProjectHostingPlatforms, ProjectTypeIcons} from "@/lib/docs/projectInfo";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {cn} from "@repo/ui/lib/utils";
import * as React from "react";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {Label} from "@repo/ui/components/label";
import DevProjectSectionTitle from "@/components/dev/project/DevProjectSectionTitle";
import ProjectGitRevision from "@/components/dev/project/ProjectGitRevision";
import {ProjectPlatform} from "@repo/shared/types/platform";
import {DevProject, Project} from "@repo/shared/types/service";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {ProjectStatus} from "@repo/shared/types/api/project";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import LiveProjectDeployConnection from "@/components/dev/project/LiveProjectDeployConnection";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import authSession from "@/lib/authSession";
import navigation from "@/lib/navigation";

export const dynamic = 'force-dynamic';

function DataField({title, className, icon: Icon, value, iconClass, href}: {
  title: string;
  className?: string;
  icon?: any;
  value: any;
  iconClass?: string;
  href?: string;
}) {
  const Element = href ? 'a' : 'div';
  return (
    <div className="flex flex-col gap-y-3">
      <Label>
        {title}
      </Label>
      <Element href={href} target="_blank" className="relative">
        {Icon && <Icon className={cn('absolute inset-0 top-1/2 left-3 size-4 -translate-y-1/2', iconClass)}/>}
        <div
          className={cn(`
            flex h-10 w-full rounded-md border border-quaternary bg-primary-dim px-3 py-2 pl-9 align-bottom text-sm
            leading-5.5
          `,
            Icon && 'pl-9', href && 'underline-offset-4 hover:underline', className)}>
          {value}
        </div>
        {href && <ExternalLinkIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2"/>}
      </Element>
    </div>
  )
}

async function ProjectPlatforms({project}: { project: Project }) {
  const t = await getTranslations('DevProjectPage.platforms');

  const entries = await Promise.all(Object.keys(project.platforms).map(async platform => {
    const p = ProjectHostingPlatforms[platform as ProjectPlatform]!;
    const value = project.platforms[platform as ProjectPlatform] as any;
    const url = platforms.getProjectURL(platform as ProjectPlatform, value, project.type);

    return <DataField className="font-mono" key={platform} title={p.name} icon={p.icon} value={value} href={url}/>;
  }));

  return (
    <div className="flex w-full max-w-lg min-w-0 flex-col gap-5">
      <DevProjectSectionTitle title={t('title')} desc={t('desc')} icon={CloudyIcon}/>

      <div className="space-y-5">
        {...entries}
      </div>
    </div>
  )
}

function ProjectInfo({project}: { project: Project }) {
  const t = useTranslations('DevProjectPage.information');
  const u = useTranslations('ProjectStatus');
  const v = useTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[project.type];

  const statuses: { [key in ProjectStatus]: { text: string; icon: any, iconClass?: string; } } = {
    [ProjectStatus.HEALTHY]: {text: 'text-[var(--vp-c-success-2)]', icon: CheckIcon},
    [ProjectStatus.AT_RISK]: {text: 'text-[var(--vp-c-danger-1)]', icon: AlertCircleIcon},
    [ProjectStatus.LOADING]: {text: 'text-warning', iconClass: 'animate-spin', icon: LoaderCircleIcon},
    [ProjectStatus.ERROR]: {text: 'text-destructive', icon: XIcon},
    [ProjectStatus.UNKNOWN]: {text: 'text-secondary', icon: HelpCircleIcon}
  };
  const status = project.status || ProjectStatus.UNKNOWN;
  const StatusIcon = statuses[status].icon;

  return (
    <div className="flex w-full max-w-lg min-w-0 flex-col gap-4">
      <DevProjectSectionTitle title={t('title')} desc={t('desc')} icon={InfoIcon}/>

      <div className="space-y-5">
        <DataField title={t('type')} icon={TypeIcon} value={v(project.type)}/>
        <DataField title={t('status')} icon={StatusIcon} value={u(status)} className={statuses[status].text}
                   iconClass={cn(statuses[status].text, statuses[status].iconClass)}/>
        <DataField title={t('created_at')} icon={ClockIcon}
                   value={project.created_at && format(project.created_at, 'yyyy-MM-dd HH:mm')}/>

        <DataField title="Source visibility" icon={project.is_public ? GlobeIcon : LockIcon}
                   value={project.is_public ? 'Public' : 'Private'}/>
      </div>
    </div>
  )
}

async function ProfileProject({project}: { project: DevProject }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectPage');
  const u = await getTranslations('DevProjectPage.overview');

  return (
    <div className="flex flex-col justify-between gap-3 py-1">
      <DevProjectPageTitle title={u('title')} desc={u('desc')}/>

      <div
        className="flex w-full flex-row gap-4 rounded-md border border-tertiary bg-primary-alt p-4">
        <ImageWithFallback className="size-16 rounded-sm sm:size-19" src={platformProject.icon_url}
                           alt="Project icon" width={64} height={64}/>

        <div className="flex flex-col justify-between">
          <p className="font-medium text-primary sm:text-lg">
            {platformProject.name}
          </p>
          <p className="min-h-6 text-sm font-normal text-secondary sm:text-base">
            {platformProject.summary}
          </p>
        </div>
      </div>

      <div>
        <ProjectGitRevision
          loading={project.status === ProjectStatus.LOADING}
          revision={project.revision}
          current
        />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-4">
        <LocaleNavLink href={navigation.getProjectLink(project.id)} target="_blank">
          <Button variant="outline" size="sm">
            <ExternalLinkIcon className="mr-2 h-4 w-4"/>
            {t('toolbar.view')}
          </Button>
        </LocaleNavLink>
        <LocaleNavLink href={`${project.id}/deployments`}>
          <Button variant="outline" size="sm">
            <HardDriveIcon className="mr-2 h-4 w-4"/>
            {t('toolbar.deployments')}
          </Button>
        </LocaleNavLink>
      </div>

      <hr className="my-2"/>

      <div className="flex flex-row flex-wrap justify-between gap-5">
        <ProjectInfo project={project}/>
        <ProjectPlatforms project={project}/>
      </div>
    </div>
  )
}

export default async function DevProjectPage(props: { params: Promise<{ locale: string; project: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  const project = handleApiCall(await devProjectApi.getProject(params.project));
  const token = (await authSession.getSession())?.token ?? null;

  return (
    <GetStartedContextProvider>
      <ClientLocaleProvider keys={['LiveProjectDeployConnection']}>
        <LiveProjectDeployConnection id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}/>
      </ClientLocaleProvider>

      <ProfileProject project={project}/>
    </GetStartedContextProvider>
  )
}