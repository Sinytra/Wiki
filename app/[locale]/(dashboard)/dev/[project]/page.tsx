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
import {getMessages} from "next-intl/server";
import ProjectLogs from "@/components/dev/new/ProjectLogs";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import ProjectRevalidateForm from "@/components/dev/ProjectRevalidateForm";
import {pick} from "lodash";
import {
  fetchProjectLog,
  handleDeleteProjectForm,
  handleEditProjectForm,
  handleRevalidateDocs
} from "@/lib/forms/actions";
import ProjectSettingsForm from "@/components/dev/ProjectSettingsForm";
import ProjectDeletion from "@/components/dev/ProjectDeletion";
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
import ProjectSettingsContextProvider from "@/components/dev/new/ProjectSettingsContextProvider";
import ProjectSourceSettingsButton from "@/components/dev/new/ProjectSourceSettingsButton";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import LinkTextButton from "@/components/ui/link-text-button";
import {format} from "date-fns";
import {ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import GetStartedContextProvider from "@/components/dev/get-started/GetStartedContextProvider";
import {cn} from "@/lib/utils";
import {sha256} from "hash-wasm";

interface DevProject extends Project {
  source_repo: string;
  source_branch: string;
  source_path: string;
  is_public: boolean;
  status?: ProjectStatus;
  created_at: string;
}

function ScrollableCell({children}: { children?: any }) {
  return (
    <div className={cn('overflow-auto slim-scrollbar max-w-sm break-all')}>
      {children}
    </div>
  )
}

function ProjectSource({project}: { project: DevProject }) {
  const sourceLink = `https://github.com/${project.source_repo}/tree/${project.source_branch}${project.source_path}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <CodeXmlIcon className="w-5 h-5"/>
          Project Source
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
          <td>
            <BookMarkedIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Repository
          </td>
          <td>
            <ScrollableCell>
              {project.source_repo}
            </ScrollableCell>
          </td>
        </tr>
        <tr>
          <td>
            <GitBranchIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Branch
          </td>
          <td>
            <ScrollableCell>
              {project.source_branch}
            </ScrollableCell>
          </td>
        </tr>
        <tr>
          <td>
            <MapIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Path
          </td>
          <td>
            <ScrollableCell>
              {project.source_path}
            </ScrollableCell>
          </td>
        </tr>
        <tr>
          <td>
            <GlobeIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Public
          </td>
          <td>{project.is_public ? <CheckIcon className="w-5 h-5"/> : <XIcon className="w-5 h-5"/>}</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

function ProjectPlatforms({project}: { project: DevProject }) {
  const plats = {
    curseforge: {name: 'CurseForge', icon: CurseForgeIcon},
    modrinth: {name: 'Modrinth', icon: ModrinthIcon}
  } as any;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2">
        <CloudyIcon className="w-5 h-5"/>
        Platforms
      </div>

      <table>
        <thead>
        <tr>
          <th>Platform</th>
          <th>Slug / ID</th>
          <th>Link</th>
        </tr>
        </thead>
        <tbody>
        {...Object.keys(project.platforms).map(platform => {
          const p = plats[platform]!;
          const value = project.platforms[platform as ProjectPlatform] as any;

          return (
            <tr key={platform}>
              <td>
                <p.icon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
                {p.name}
              </td>
              <td>
                <ScrollableCell>
                  {value}
                </ScrollableCell>
              </td>
              <td>
                <LinkTextButton className="align-middle mb-0.5" target="_blank"
                                href={platforms.getProjectURL(platform as ProjectPlatform, value)}>
                  <ExternalLinkIcon className="mr-2 w-4 h-4 text-muted-foreground"/>
                  Open
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

function ProjectInfo({project}: { project: DevProject }) {
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
          Information
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <td>
            <TypeIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Type
          </td>
          <td>
            {v(project.type)}
          </td>
        </tr>
        <tr>
          <td>
            <ServerIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Status
          </td>
          <td className={statuses[status].text}>
            <StatusIcon className={cn('mr-1 mb-0.5 inline-block w-5 h-5', statuses[status].iconClass)}/>
            {u(status)}
          </td>
        </tr>
        <tr>
          <td>
            <ClockIcon className="inline-block mb-0.5 mr-2 w-4 h-4"/>
            Created at
          </td>
          <td>{format(project.created_at, 'yyyy-MM-dd HH:mm')}</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

async function ProfileProject({project}: { project: DevProject }) {
  const platformProject = await platforms.getPlatformProject(project);
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
              View
            </Button>
          </LocaleNavLink>
          <NextIntlClientProvider messages={pick(messages, 'ProjectRevalidateForm', 'FormActions')}>
            <ProjectRevalidateForm action={handleRevalidateDocs.bind(null, project.id)}/>
          </NextIntlClientProvider>
          <div className="flex flex-row gap-4 items-center ml-auto">
            <NextIntlClientProvider
              messages={pick(messages, 'ProjectSettingsForm', 'ProjectRegisterForm', 'FormActions')}>
              <ProjectSettingsForm mod={project} formAction={handleEditProjectForm}/>
            </NextIntlClientProvider>
            <NextIntlClientProvider messages={pick(messages, 'ProjectDeletionForm')}>
              <ProjectDeletion action={handleDeleteProjectForm.bind(null, project.id)}/>
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
              <ProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} hashedToken={hashedToken}
                           callback={fetchProjectLog}/>
          </div>
        }
      </div>
    </ProjectSettingsContextProvider>
  </>
}

export default async function DevProject({params}: { params: { project: string } }) {
  const session = await auth();
  if (!session) {
    return redirect('/dev');
  }

  const project = await remoteServiceApi.getDevProject(session.access_token, params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const platformProject = await platforms.getPlatformProject(project);

  return (
    <GetStartedContextProvider>
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dev">
                  Projects
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

        <ProfileProject project={project as DevProject}/>
      </div>
    </GetStartedContextProvider>
  )
}