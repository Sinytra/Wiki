import {Link, setContextLocale} from "@/lib/locales/routing";
import {BreadcrumbLink, BreadcrumbPage} from "@repo/ui/components/breadcrumb";
import DevBreadcrumb from "@/components/dashboard/dev/navigation/DevBreadcrumb";
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";
import {Button} from "@repo/ui/components/button";
import {
  BookIcon,
  ClockFadingIcon,
  ExternalLinkIcon,
  FolderIcon,
  GitBranchIcon,
  GlobeIcon,
  HardDriveUploadIcon,
  MoreHorizontal
} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import * as React from "react";
import {DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger} from "@repo/ui/components/dropdown-menu";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import DeleteDeploymentModal from "@/components/dashboard/dev/modal/DeleteDeploymentModal";
import {handleDeleteDeploymentForm} from "@/lib/forms/actions";
import {Badge} from "@repo/ui/components/badge";
import DeploymentStatusInfo from "@/components/dashboard/dev/project/DeploymentStatusInfo";
import ProjectGitRevision from "@/components/dashboard/dev/project/ProjectGitRevision";
import ProjectIssuesList from "@/components/dashboard/dev/project/ProjectIssuesList";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {DeploymentStatus, FullDevProjectDeployment} from "@repo/shared/types/api/deployment";
import {ProjectIssue} from "@repo/shared/types/api/project";
import ContextDropdownMenu from "@/components/util/ContextDropdownMenu";
import LocalDateTime from "@repo/ui/util/LocalDateTime";
import navigation from "@/lib/navigation";

type Properties = {
  params: Promise<{
    locale: string;
    project: string;
    deployment: string;
  }>
}

function StatusInfoColumn({name, children}: { name: string; children: any; }) {
  return (
    <div className="flex flex-col gap-1 xl:gap-1.5">
      <span className="text-sm text-secondary">
        {name}
      </span>
      <div className="text-sm text-primary">
        {children}
      </div>
    </div>
  )
}

function DeploymentIssues({issues}: { issues: ProjectIssue[] }) {
  const t = useTranslations('DeploymentIssues');

  return (
    <div className="flex flex-col gap-1 rounded-sm border border-tertiary bg-primary-dim p-3">
      <div className="flex flex-row items-center gap-2">
        <span className="text-base">
          {t('title')}
        </span>
      </div>
      {issues.length > 0 ?
        <div className="flex flex-col gap-4">
            <span className="text-sm text-secondary">
              {t('issues_found', {count: issues.length})}
            </span>
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            <ProjectIssuesList issues={issues}/>
          </div>
        </div>
        :
        <span className="text-sm text-secondary">
          {t('empty')}
        </span>
      }
    </div>
  )
}

// TODO Locales
function DeploymentInfoWdget({deployment}: { deployment: FullDevProjectDeployment }) {
  return (
    <div className={`
      grid grid-cols-2 gap-4 rounded-sm border border-tertiary bg-primary-dim p-3 xl:grid-cols-4 [&>div]:flex-[0_1_auto]
    `}>
      <StatusInfoColumn name="Activation">
        {deployment.active ?
          <Badge variant="secondary" className="border-lightblue-primary px-2 text-lightblue-primary">
            <GlobeIcon className="mr-2 size-3"/>
            Current
          </Badge>
          :
          <Badge variant="secondary" className="border-gray-600 px-2 text-gray-400">
            <ClockFadingIcon className="mr-2 size-3"/>
            Inactive
          </Badge>
        }
      </StatusInfoColumn>

      <StatusInfoColumn name="Status">
        <DeploymentStatusInfo status={deployment.status}/>
      </StatusInfoColumn>

      <StatusInfoColumn name="Created by">
        {deployment.user_id || '-'}
      </StatusInfoColumn>

      <StatusInfoColumn name="Created at">
        <LocalDateTime className="text-sm" form="LLL d, yyyy" dateTime={new Date(deployment.created_at)}/>
      </StatusInfoColumn>
    </div>
  )
}

function DeploymentGitCoordinates({deployment}: { deployment: FullDevProjectDeployment; }) {
  const t = useTranslations('DevProjectDeploymentPage.git-config');

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-tertiary bg-primary-dim p-3">
      <div className="flex flex-row items-center gap-2">
        <span className="text-base">
          {t('title')}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-5 items-center justify-center">
            <BookIcon className="size-4"/>
          </div>
          <a className="text-sm underline-offset-4 hover:underline" href={deployment.source_repo} target="_blank" rel="noreferrer">
            {deployment.source_repo}
          </a>
        </div>

        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-5 items-center justify-center">
            <GitBranchIcon className="size-4"/>
          </div>
          <span className="font-mono text-sm">
            {deployment.source_branch}
          </span>
        </div>

        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-5 items-center justify-center">
            <FolderIcon className="size-4"/>
          </div>
          <span className="font-mono text-sm">
            {deployment.source_path}
          </span>
        </div>
      </div>
    </div>
  )
}

function DeploymentInfo({deployment, redirectTo}: { deployment: FullDevProjectDeployment; redirectTo: string }) {
  const t = useTranslations('DevProjectDeploymentPage');

  return (
    <div className="space-y-4">
      <div className="flex flex-row">
        <h1 className="text-lg font-medium">
          {t('title')}
        </h1>

        <div className="ml-auto flex flex-row gap-2">
          {deployment.active &&
            <LocaleNavLink href={navigation.getProjectLink(deployment.project_id)} target="_blank">
                <Button size="sm">
                    <ExternalLinkIcon className="mr-2 h-4 w-4"/>
                    Visit
                </Button>
            </LocaleNavLink>
          }

          <ContextDropdownMenu
            content={<>
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>

              <DropdownMenuItem disabled>
              <span className="flex flex-row items-center">
                <HardDriveUploadIcon className="mr-2 size-3"/>
                Redeploy
              </span>
              </DropdownMenuItem>

              <ClientLocaleProvider keys={['DeleteDeploymentModal']}>
                <DeleteDeploymentModal
                  action={handleDeleteDeploymentForm.bind(null, deployment.id)}
                  loading={deployment.status == DeploymentStatus.LOADING}
                  redirectTo={redirectTo}
                />
              </ClientLocaleProvider>
            </>}
          >
            <DropdownMenuTrigger asChild>
              <Button className="size-9! p-0!">
              <span className="sr-only">
                Open
              </span>
                <MoreHorizontal className="w-5"/>
              </Button>
            </DropdownMenuTrigger>
          </ContextDropdownMenu>
        </div>
      </div>

      <div className="space-y-4">
        <DeploymentInfoWdget deployment={deployment}/>

        <DeploymentGitCoordinates deployment={deployment}/>

        <ProjectGitRevision
          revision={deployment.revision}
          loading={deployment.status === DeploymentStatus.LOADING}
        />

        <DeploymentIssues issues={deployment.issues}/>
      </div>
    </div>
  )
}

export default async function DevProjectDeploymentPage(props: Properties) {
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectDeploymentPage');
  const fallback = `/dev/project/${params.project}/deployments`;
  const content = handleApiCall(await devProjectApi.getDeployment(params.deployment), fallback);

  return (
    <div>
      <DevBreadcrumb home={
        <BreadcrumbLink asChild>
          <Link href={`/dev/project/${params.project}/deployments`}>
            {t('deployments')}
          </Link>
        </BreadcrumbLink>
      }>
        <BreadcrumbPage className="font-mono text-xsm text-primary">
          {params.deployment.substring(0, 9)}
        </BreadcrumbPage>
      </DevBreadcrumb>

      <DeploymentInfo deployment={content} redirectTo={fallback}/>
    </div>
  )
}