import {setContextLocale} from '@/lib/locales/routing';
import platforms from '@repo/shared/platforms';
import {getTranslations} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import {
  AlertCircleIcon,
  CheckIcon,
  ClockIcon,
  CloudyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  HelpCircleIcon,
  InfoIcon,
  LoaderCircleIcon,
  LockIcon, MoonIcon,
  XIcon
} from 'lucide-react';
import {LocaleNavLink} from '@/components/navigation/link/LocaleNavLink';
import {Button} from '@repo/ui/components/button';
import {format} from 'date-fns';
import {ProjectHostingPlatforms, ProjectTypeIcons} from '@/lib/project/projectTypes';
import GetStartedContextProvider from '@/components/dashboard/dev/get-started/GetStartedContextProvider';
import {cn} from '@repo/ui/lib/utils';
import * as React from 'react';
import DevProjectPageTitle from '@/components/dashboard/dev/project/DevProjectPageTitle';
import DevProjectSectionTitle from '@/components/dashboard/dev/project/DevProjectSectionTitle';
import ProjectGitRevision from '@/components/dashboard/dev/project/ProjectGitRevision';
import {ProjectPlatform} from '@repo/shared/types/platform';
import {DevProjectData} from '@sinytra/wiki-api-types';
import {handleApiCall} from '@/lib/service/serviceUtil';
import devProjectApi from '@/lib/service/api/devProjectApi';
import {ProjectStatus} from '@sinytra/wiki-api-types';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import LiveProjectDeployConnection from '@/components/dashboard/dev/project/LiveProjectDeployConnection';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import navigation from '@/lib/navigation';
import DataField from '@/components/util/DataField';
import NewProjectBanner from '@/components/dashboard/dev/banner/NewProjectBanner';

export const dynamic = 'force-dynamic';

async function ProjectPlatforms({project}: { project: DevProjectData }) {
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
  );
}

function ProjectInfo({project}: { project: DevProjectData }) {
  const t = useTranslations('DevProjectPage.information');
  const u = useTranslations('ProjectStatus');
  const v = useTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[project.type];

  const statuses: { [key in ProjectStatus | 'unknown']: { text: string; icon: any, iconClass?: string; } } = {
    healthy: {text: 'text-[var(--vp-c-success-2)]', icon: CheckIcon},
    at_risk: {text: 'text-[var(--vp-c-danger-1)]', icon: AlertCircleIcon},
    loading: {text: 'text-warning', iconClass: 'animate-spin', icon: LoaderCircleIcon},
    error: {text: 'text-destructive', icon: XIcon},
    inactive: {text: 'text-secondary', icon: MoonIcon},
    unknown: {text: 'text-secondary', icon: HelpCircleIcon}
  };
  const status = project.status || 'unknown';
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
  );
}

async function ProfileProject({project}: { project: DevProjectData }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectPage');
  const u = await getTranslations('DevProjectPage.overview');

  return (
    <div className="flex flex-col justify-between gap-3 py-1">
      <DevProjectPageTitle title={u('title')} desc={u('desc')}/>

      {project.flags.includes('unpublished') && <NewProjectBanner projectId={project.id}/>}

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
          loading={project.status === 'loading'}
          revision={project.revision}
          current
        />
      </div>

      <div className="flex flex-row flex-wrap items-center justify-end gap-4">
        <LocaleNavLink href={navigation.getProjectLink(project.id)} target="_blank">
          <Button size="sm">
            <ExternalLinkIcon className="mr-2 h-4 w-4"/>
            {t('toolbar.view')}
          </Button>
        </LocaleNavLink>
      </div>

      <hr className="my-1"/>

      <div className="flex flex-row flex-wrap justify-between gap-5">
        <ProjectInfo project={project}/>
        <ProjectPlatforms project={project}/>
      </div>
    </div>
  );
}

export default async function DevProjectDataPage(props: { params: Promise<{ locale: string; project: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  return (
    <GetStartedContextProvider>
      <ClientLocaleProvider keys={['LiveProjectDeployConnection']}>
        <LiveProjectDeployConnection id={project.id}/>
      </ClientLocaleProvider>

      <ProfileProject project={project}/>
    </GetStartedContextProvider>
  );
}