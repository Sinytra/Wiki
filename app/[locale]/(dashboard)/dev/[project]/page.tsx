import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Link} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import platforms, {ProjectPlatform} from "@/lib/platforms";
import {Project} from "@/lib/service";
import {getMessages, getTranslations} from "next-intl/server";
import DevProjectLogs from "@/components/dev/DevProjectLogs";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import ProjectRevalidateForm from "@/components/dev/modal/ProjectRevalidateForm";
import {pick} from "lodash";
import {
  fetchProjectLog,
  handleDeleteProjectForm,
  handleEditProjectForm,
  handleRevalidateDocs
} from "@/lib/forms/actions";
import ProjectSettingsForm from "@/components/dev/modal/ProjectSettingsForm";
import ProjectDeleteForm from "@/components/dev/modal/ProjectDeleteForm";
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
import ProjectSettingsContextProvider from "@/components/dev/modal/ProjectSettingsContextProvider";
import ProjectSourceSettingsButton from "@/components/dev/ProjectSourceSettingsButton";
import LinkTextButton from "@/components/ui/link-text-button";
import {format} from "date-fns";
import {ProjectHostingPlatforms, ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {cn} from "@/lib/utils";
import {sha256} from "hash-wasm";

function ScrollableCell({children}: { children?: any }) {
  return (
    <td>
      <div className={cn('overflow-auto slim-scrollbar max-w-sm break-all')}>
        {children}
      </div>
    </td>
  )
}

function IconTableCell({icon: Icon, children}: { icon: any; children?: any }) {
  return (
    <td>
      <Icon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
      {children}
    </td>
  )
}

function ProjectSource({project}: { project: Project }) {
  const sourceLink = `https://github.com/${project.source_repo}/tree/${project.source_branch}${project.source_path}`;
  const t = useTranslations('DevProjectPage.source');

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <CodeXmlIcon className="w-5 h-5"/>
          {t('title')}
        </div>

        <div className="flex flex-row gap-2">
          <LocaleNavLink href={sourceLink} target="_blank">
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ExternalLinkIcon className="w-4 h-4"/>
            </Button>
          </LocaleNavLink>
          <ProjectSourceSettingsButton/>
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <IconTableCell icon={BookMarkedIcon}>
            {t('repo')}
          </IconTableCell>
          <ScrollableCell>
            {project.source_repo}
          </ScrollableCell>
        </tr>
        <tr>
          <IconTableCell icon={GitBranchIcon}>
            {t('branch')}
          </IconTableCell>
          <ScrollableCell>
            {project.source_branch}
          </ScrollableCell>
        </tr>
        <tr>
          <IconTableCell icon={MapIcon}>
            {t('path')}
          </IconTableCell>
          <ScrollableCell>
            {project.source_path}
          </ScrollableCell>
        </tr>
        <tr>
          <IconTableCell icon={GlobeIcon}>
            {t('public')}
          </IconTableCell>
          <td>{project.is_public ? <CheckIcon className="w-5 h-5"/> : <XIcon className="w-5 h-5"/>}</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

function ProjectPlatforms({project}: { project: Project }) {
  const t = useTranslations('DevProjectPage.platforms');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2">
        <CloudyIcon className="w-5 h-5"/>
        {t('title')}
      </div>

      <table>
        <thead>
        <tr>
          <th>{t('headers.platform')}</th>
          <th>{t('headers.slug')}</th>
          <th>{t('headers.link')}</th>
        </tr>
        </thead>
        <tbody>
        {...Object.keys(project.platforms).map(platform => {
          const p = ProjectHostingPlatforms[platform as ProjectPlatform]!;
          const value = project.platforms[platform as ProjectPlatform] as any;

          return (
            <tr key={platform}>
              <IconTableCell icon={p.icon}>
                {p.name}
              </IconTableCell>
              <ScrollableCell>
                {value}
              </ScrollableCell>
              <td>
                <LinkTextButton className="align-middle mb-0.5" target="_blank"
                                href={platforms.getProjectURL(platform as ProjectPlatform, value)}>
                  <ExternalLinkIcon className="mr-2 w-4 h-4 text-muted-foreground"/>
                  {t('open')}
                </LinkTextButton>
              </td>
            </tr>
          );
        })}
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
    <div className="flex flex-col gap-3">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <InfoIcon className="w-5 h-5"/>
          {t('title')}
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <td>
            <TypeIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            {t('type')}
          </td>
          <td>
            {v(project.type)}
          </td>
        </tr>
        <tr>
          <td>
            <ServerIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            {t('status')}
          </td>
          <td className={statuses[status].text}>
            <StatusIcon className={cn('mr-1 mb-0.5 inline-block w-5 h-5', statuses[status].iconClass)}/>
            {u(status)}
          </td>
        </tr>
        <tr>
          <td>
            <ClockIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            {t('created_at')}
          </td>
          <td>{format(project.created_at, 'yyyy-MM-dd HH:mm')}</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

async function ProfileProject({project}: { project: Project }) {
  const platformProject = await platforms.getPlatformProject(project);
  const t = await getTranslations('DevProjectPage');
  const messages = await getMessages();

  const session = await auth();
  const token = session?.access_token;
  const hashedToken = token ? await sha256(token) : '';

  return <>
    <ProjectSettingsContextProvider>
      <div className="flex flex-col justify-between gap-3">
        <div
          className="flex flex-row gap-4 p-4 w-full border border-[hsl(var(--sidebar-border))] rounded-md bg-[hsl(var(--sidebar-background))]">
          <img className="rounded-md" src={platformProject.icon_url} alt="Project icon" width={84} height={84}/>

          <div className="flex flex-col gap-2">
            <Link href={`/dev/${project.id}`}>
              <p className="text-foreground font-medium text-lg">
                {platformProject.name}
              </p>
            </Link>
            <p className="text-muted-foreground font-normal min-h-6">
              {platformProject.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <LocaleNavLink href={`/project/${project.id}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLinkIcon className="mr-2 w-4 h-4"/>
              {t('toolbar.view')}
            </Button>
          </LocaleNavLink>
          <NextIntlClientProvider messages={pick(messages, 'ProjectRevalidateForm', 'FormActions')}>
            <ProjectRevalidateForm action={handleRevalidateDocs.bind(null, project.id)}/>
          </NextIntlClientProvider>
          <div className="flex flex-row gap-4 items-center ml-auto">
            <NextIntlClientProvider
              messages={pick(messages, 'ProjectSettingsForm', 'ProjectRegisterForm', 'FormActions', 'DevPageRefreshTransition')}>
              <ProjectSettingsForm mod={project} formAction={handleEditProjectForm}/>
            </NextIntlClientProvider>
            <NextIntlClientProvider messages={pick(messages, 'ProjectDeleteForm')}>
              <ProjectDeleteForm action={handleDeleteProjectForm.bind(null, project.id)}/>
            </NextIntlClientProvider>
          </div>
        </div>

        <hr className="my-2"/>

        <div className="flex flex-row justify-between flex-wrap gap-3">
          <ProjectSource project={project}/>
          <ProjectPlatforms project={project}/>
          <ProjectInfo project={project}/>
        </div>

        <hr className="my-2"/>

        {project.status !== ProjectStatus.UNKNOWN &&
          <div>
              <NextIntlClientProvider messages={pick(messages, 'DevProjectLogs')}>
                  <DevProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} hashedToken={hashedToken}
                                  callback={fetchProjectLog}/>
              </NextIntlClientProvider>
          </div>
        }
      </div>
    </ProjectSettingsContextProvider>
  </>
}

export default async function DevProjectPage({params}: { params: { project: string } }) {
  const session = await auth();
  if (!session) {
    return redirect('/dev');
  }

  const project = await remoteServiceApi.getDevProject(session.access_token, params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const t = await getTranslations('DevProjectPage');
  const platformProject = await platforms.getPlatformProject(project);

  return (
    <GetStartedContextProvider>
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dev">
                  {t('breadcrumbs.projects')}
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