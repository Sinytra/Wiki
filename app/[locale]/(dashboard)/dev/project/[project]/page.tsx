import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {DevProject, Project, ProjectRevision} from "@/lib/service";
import {getMessages, getTranslations} from "next-intl/server";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import ProjectRevalidateForm from "@/components/dev/modal/ProjectRevalidateForm";
import {pick} from "lodash";
import {handleRevalidateDocs} from "@/lib/forms/actions";
import {
  CheckIcon,
  ClockIcon,
  CloudyIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  HelpCircleIcon,
  InfoIcon,
  LoaderCircleIcon,
  LockIcon,
  XIcon
} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import {ProjectHostingPlatforms, ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {cn} from "@/lib/utils";
import * as React from "react";
import DevProjectPageTitle from "@/components/dev/DevProjectPageTitle";
import {Label} from "@/components/ui/label";
import DevProjectSectionTitle from "@/components/dev/DevProjectSectionTitle";
import LocalDateTime from "@/components/util/LocalDateTime";
import LiveProjectConnection from "@/components/dev/LiveProjectConnection";
import authSession from "@/lib/authSession";

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
        {Icon && <Icon className={cn('absolute inset-0 top-1/2 -translate-y-1/2 left-3 size-4', iconClass)}/>}
        <div
          className={cn('flex h-10 w-full rounded-md border border-quaternary bg-primary-dim px-3 py-2 text-sm pl-9 align-bottom leading-5.5',
            Icon && 'pl-9', href && 'hover:underline underline-offset-4', className)}>
          {value}
        </div>
        {href && <ExternalLinkIcon className="absolute top-1/2 -translate-y-1/2 right-3 size-4"/>}
      </Element>
    </div>
  )
}

async function ProjectPlatforms({project}: { project: Project }) {
  const t = await getTranslations('DevProjectPage.platforms');

  const entries = await Promise.all(Object.keys(project.platforms).map(async platform => {
    const p = ProjectHostingPlatforms[platform as ProjectPlatform]!;
    const value = project.platforms[platform as ProjectPlatform] as any;
    const url = await platforms.getProjectURL(platform as ProjectPlatform, value); // TODO

    return <DataField className="font-mono" title={p.name} icon={p.icon} value={value} href={url}/>;
  }));

  return (
    <div className="w-full max-w-lg flex flex-col gap-5 min-w-0">
      <DevProjectSectionTitle title={t('title')} desc="Resolved information" icon={CloudyIcon}/>

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
    [ProjectStatus.LOADED]: {text: 'text-[var(--vp-c-success-2)]', icon: CheckIcon},
    [ProjectStatus.LOADING]: {text: 'text-warning', iconClass: 'animate-spin', icon: LoaderCircleIcon},
    [ProjectStatus.ERROR]: {text: 'text-destructive', icon: XIcon},
    [ProjectStatus.UNKNOWN]: {text: '', icon: HelpCircleIcon}
  };
  const status = project.status || ProjectStatus.UNKNOWN;
  const StatusIcon = statuses[status].icon;

  return (
    <div className="w-full max-w-lg flex flex-col gap-4 min-w-0">
      <DevProjectSectionTitle title={t('title')} desc="Resolved information" icon={InfoIcon}/>

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

function LinkWithFallback({className, href, children}: { className?: string, href?: string; children?: any }) {
  return (
    href ?
      <a href={href} target="_blank" className={cn(className, 'hover:underline hover:underline-offset-4')}>
        {children}
      </a>
      :
      <span className={className}>
        {children}
      </span>
  );
}

function ProjectRevisionInfo({status, revision}: { status?: ProjectStatus, revision?: ProjectRevision }) {
  return (
    <div className="flex flex-col p-3 rounded-sm border border-tertiary bg-primary-dim gap-2">
      <div className="flex flex-row gap-2 items-center">
        <GitBranchIcon className="size-4"/>
        <span>Current git revision</span>
      </div>
      {revision ?
        <div className="flex flex-row gap-4 items-start text-sm">
          <LinkWithFallback href={revision.url} className="font-mono text-secondary shrink-0">
            {revision.hash}
          </LinkWithFallback>
          <span className="text-secondary" title={revision.authorEmail}>
            {revision.authorName}
          </span>
          <LinkWithFallback href={revision.url}>
            {revision.message}
          </LinkWithFallback>
          <span className="ml-auto text-sm text-secondary shrink-0">
            <LocalDateTime dateTime={new Date(revision.date)}/>
          </span>
        </div>
        : status === ProjectStatus.LOADING
          ?
          <div className="text-secondary text-sm">
            Reloading project, please stand by...
          </div>
          :
          <div className="text-secondary text-sm">
            No revision found. Try reloading the project.
          </div>
      }
    </div>
  )
}

async function ProfileProject({project}: { project: DevProject }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectPage');
  const messages = await getMessages();

  return (
    <div className="py-1 flex flex-col justify-between gap-3">
      <DevProjectPageTitle title="Project overview" desc="Project information summary"/>

      <div
        className="flex flex-row gap-4 p-4 w-full border border-tertiary rounded-md bg-primary-alt">
        <img className="rounded-sm size-16 sm:size-19" src={platformProject.icon_url} alt="Project icon"/>

        <div className="flex flex-col justify-between">
          <p className="text-primary font-medium sm:text-lg">
            {platformProject.name}
          </p>
          <p className="text-secondary font-normal min-h-6 text-sm sm:text-base">
            {platformProject.summary}
          </p>
        </div>
      </div>

      <div>
        <ProjectRevisionInfo status={project.status} revision={project.revision}/>
      </div>

      <div className="flex flex-row flex-wrap gap-4 items-center">
        <LocaleNavLink href={`/project/${project.id}`} target="_blank">
          <Button variant="outline" size="sm">
            <ExternalLinkIcon className="mr-2 w-4 h-4"/>
            {t('toolbar.view')}
          </Button>
        </LocaleNavLink>
        <NextIntlClientProvider messages={pick(messages, 'ProjectRevalidateForm', 'FormActions')}>
          <ProjectRevalidateForm action={handleRevalidateDocs.bind(null, project.id)}/>
        </NextIntlClientProvider>
      </div>

      <hr className="my-2"/>

      <div className="flex flex-row flex-wrap justify-between gap-5">
        <ProjectInfo project={project}/>
        <ProjectPlatforms project={project}/>
      </div>
    </div>
  )
}

export default async function DevProjectPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const token = authSession.getSession()?.token!;

  return (
    <GetStartedContextProvider>
      <LiveProjectConnection id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}/>
      <ProfileProject project={project}/>
    </GetStartedContextProvider>
  )
}