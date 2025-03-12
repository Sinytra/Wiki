import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Link, setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {DevProject, Project} from "@/lib/service";
import {getMessages, getTranslations} from "next-intl/server";
import DevProjectLogs from "@/components/dev/DevProjectLogs";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import ProjectRevalidateForm from "@/components/dev/modal/ProjectRevalidateForm";
import {pick} from "lodash";
import {fetchProjectLog, handleRevalidateDocs} from "@/lib/forms/actions";
import {
  BookMarkedIcon,
  CheckIcon,
  ClockIcon,
  CloudyIcon,
  CodeXmlIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  HelpCircleIcon,
  InfoIcon,
  LoaderCircleIcon,
  MapIcon,
  ServerIcon,
  XIcon
} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Button} from "@/components/ui/button";
import LinkTextButton from "@/components/ui/link-text-button";
import {format} from "date-fns";
import {ProjectHostingPlatforms, ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {cn} from "@/lib/utils";
import {SidebarTrigger} from "@/components/ui/sidebar";
import authSession from "@/lib/authSession";

export const dynamic = 'force-dynamic';

function ValueTableCell({className, hideOverflow, children}: {
  className?: string;
  hideOverflow?: boolean;
  children?: any
}) {
  return (
    <td className={className}>
      <div className={cn('slim-scrollbar sm:max-w-sm break-all', !hideOverflow && 'overflow-auto')}>
        {children}
      </div>
    </td>
  )
}

function IconTableCell({icon: Icon, children}: { icon: any; children?: any }) {
  return (
    <td className="whitespace-nowrap">
      <Icon className="inline-block sm:mb-0.5 mr-2 w-4 h-4"/>
      {children}
    </td>
  )
}

function ProjectSource({project}: { project: DevProject }) {
  const t = useTranslations('DevProjectPage.source');
  const Icon = project.is_public ? CheckIcon : XIcon;

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <CodeXmlIcon className="w-5 h-5"/>
          {t('title')}
        </div>

        <div className="flex flex-row gap-2">
          <LocaleNavLink href={project.source_repo} target="_blank">
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ExternalLinkIcon className="w-4 h-4"/>
            </Button>
          </LocaleNavLink>
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <IconTableCell icon={BookMarkedIcon}>
            {t('repo')}
          </IconTableCell>
          <ValueTableCell>
            {project.source_repo}
          </ValueTableCell>
        </tr>
        <tr>
          <IconTableCell icon={GitBranchIcon}>
            {t('branch')}
          </IconTableCell>
          <ValueTableCell>
            {project.source_branch}
          </ValueTableCell>
        </tr>
        <tr>
          <IconTableCell icon={MapIcon}>
            {t('path')}
          </IconTableCell>
          <ValueTableCell>
            {project.source_path}
          </ValueTableCell>
        </tr>
        <tr>
          <IconTableCell icon={GlobeIcon}>
            {t('public')}
          </IconTableCell>
          <td>
            <Icon className="w-5 h-5"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

async function ProjectPlatforms({project}: { project: Project }) {
  const t = await getTranslations('DevProjectPage.platforms');

  const entries = await Promise.all(Object.keys(project.platforms).map(async platform => {
    const p = ProjectHostingPlatforms[platform as ProjectPlatform]!;
    const value = project.platforms[platform as ProjectPlatform] as any;
    const url = await platforms.getProjectURL(platform as ProjectPlatform, value);

    return (
      <tr key={platform}>
        <IconTableCell icon={p.icon}>
          {p.name}
        </IconTableCell>
        <ValueTableCell>
          {value}
        </ValueTableCell>
        <td>
          <LinkTextButton className="align-middle mb-0.5" target="_blank" href={url}>
            <ExternalLinkIcon className="mr-2 w-4 h-4 text-secondary"/>
            {t('open')}
          </LinkTextButton>
        </td>
      </tr>
    );
  }));

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex flex-row items-center gap-2">
        <CloudyIcon className="w-5 h-5"/>
        {t('title')}
      </div>

      <table>
        <thead>
        <tr className="[&_th]:text-sm sm:[&_th]:text-base">
          <th>{t('headers.platform')}</th>
          <th>{t('headers.slug')}</th>
          <th>{t('headers.link')}</th>
        </tr>
        </thead>
        <tbody>
        {...entries}
        </tbody>
      </table>
    </div>
  )
}

function ProjectInfo({project}: { project: Project }) {
  const t = useTranslations('DevProjectPage.information');
  const u = useTranslations('ProjectStatus');
  const v = useTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[project.type];

  const statuses: { [key in ProjectStatus]: { text: string; icon: any, iconClass?: string; } } = {
    [ProjectStatus.LOADED]: {text: 'text-[var(--vp-c-success-3)]', icon: CheckIcon},
    [ProjectStatus.LOADING]: {text: 'text-warning', iconClass: 'animate-spin', icon: LoaderCircleIcon},
    [ProjectStatus.ERROR]: {text: 'text-destructive', icon: XIcon},
    [ProjectStatus.UNKNOWN]: {text: '', icon: HelpCircleIcon}
  };
  const status = project.status || ProjectStatus.UNKNOWN;
  const StatusIcon = statuses[status].icon;

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <InfoIcon className="w-5 h-5"/>
          {t('title')}
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <IconTableCell icon={TypeIcon}>
            {t('type')}
          </IconTableCell>
          <ValueTableCell>
            {v(project.type)}
          </ValueTableCell>
        </tr>
        <tr>
          <IconTableCell icon={ServerIcon}>
            {t('status')}
          </IconTableCell>
          <ValueTableCell className={statuses[status].text} hideOverflow>
            <StatusIcon className={cn('mr-1 sm:mb-0.5 inline-block w-5 h-5', statuses[status].iconClass)}/>
            {u(status)}
          </ValueTableCell>
        </tr>
        <tr>
          <IconTableCell icon={ClockIcon}>
            {t('created_at')}
          </IconTableCell>
          <ValueTableCell>
            {project.created_at && format(project.created_at, 'yyyy-MM-dd HH:mm')}
          </ValueTableCell>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

async function ProfileProject({project}: { project: DevProject }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectPage');
  const messages = await getMessages();

  // TODO Find alternative
  const token = authSession.getSession()?.token!;

  return (
    <div className="flex flex-col justify-between gap-3">
      <div
        className="flex flex-row gap-4 p-4 w-full border border-tertiary rounded-md bg-primary-alt">
        <img className="rounded-sm" width={76} height={76}
             src={platformProject.icon_url} alt="Project icon"/>

        <div className="flex flex-col gap-2">
          <p className="text-primary font-medium sm:text-lg">
            {platformProject.name}
          </p>
          <p className="text-secondary font-normal min-h-6 text-sm sm:text-base">
            {platformProject.summary}
          </p>
        </div>
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

      <div className="flex flex-row justify-between flex-wrap gap-5 sm:gap-3">
        <ProjectSource project={project}/>
        <ProjectPlatforms project={project}/>
        <ProjectInfo project={project}/>
      </div>

      <hr className="my-2"/>

      {project.status !== ProjectStatus.UNKNOWN &&
        <div>
            <NextIntlClientProvider messages={pick(messages, 'DevProjectLogs')}>
                <DevProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}
                                callback={fetchProjectLog}/>
            </NextIntlClientProvider>
        </div>
      }
    </div>
  )
}

export default async function DevProjectPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const t = await getTranslations('DevProjectPage');
  const platformProject = await platforms.getPlatformProject(project);

  return (
    <GetStartedContextProvider>
      <div>
        <Breadcrumb className="mt-1 sm:mt-0 mb-4">
          <BreadcrumbList>
            <SidebarTrigger className="-ml-1 mr-1 sm:hidden text-primary"/>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dev">
                  {t('breadcrumbs.home')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>
                {platformProject.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ProfileProject project={project}/>
      </div>
    </GetStartedContextProvider>
  )
}