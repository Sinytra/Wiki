import {Link, setContextLocale} from "@/lib/locales/routing";
import {BreadcrumbLink, BreadcrumbPage} from "@/components/ui/breadcrumb";
import DevBreadcrumb from "@/components/dev/navigation/DevBreadcrumb";
import {getTranslations} from "next-intl/server";
import remoteServiceApi, {
  DeploymentRevision, DeploymentStatus,
  FullDevProjectDeployment
} from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
  BookIcon, ClockFadingIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitCommitHorizontalIcon, GlobeIcon,
  HardDriveUploadIcon,
  MoreHorizontal
} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import * as React from "react";
import {DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import DeleteDeploymentModal from "@/components/dev/modal/DeleteDeploymentModal";
import {handleDeleteDeploymentForm} from "@/lib/forms/actions";
import ContextDropdownMenu from "@/components/ui/custom/ContextDropdownMenu";
import LocalDateTime from "@/components/util/LocalDateTime";
import {DevProject} from "@/lib/service";
import {Badge} from "@/components/ui/badge";
import DeploymentStatusInfo from "@/components/dev/project/DeploymentStatusInfo";

type Properties = {
  params: {
    locale: string;
    project: string;
    deployment: string;
  }
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

function DeploymentRevisionInfo({revision, status, project}: {
  revision: DeploymentRevision | null;
  status: DeploymentStatus;
  project: DevProject
}) {
  const t = useTranslations('DeploymentRevisionInfo');

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-tertiary bg-primary-dim p-3">
      <div className="flex flex-row items-center gap-2">
        <span>{t('title')}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-5 items-center justify-center">
            <BookIcon className="size-4"/>
          </div>
          <a className="text-sm underline-offset-4 hover:underline" href={project.source_repo} target="_blank">
            {project.source_repo}
          </a>
        </div>

        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-5 items-center justify-center">
            <GitBranchIcon className="size-4"/>
          </div>
          <span className="font-mono text-sm">
            {project.source_branch}
          </span>
        </div>

        <div className="flex w-full flex-row items-center gap-2">
          <GitCommitHorizontalIcon className="size-5"/>
          {revision ?
            <div className="flex w-full flex-row flex-wrap items-start gap-4 text-sm sm:flex-nowrap">
            <span className="shrink-0 font-mono text-secondary">
              {revision.hash}
            </span>
              <span className="text-secondary" title={revision.authorEmail}>
              {revision.authorName}
            </span>
              <span>
              {revision.message}
            </span>
              <span className="ml-auto shrink-0 text-sm text-secondary">
              <LocalDateTime dateTime={new Date(revision.date)}/>
            </span>
            </div>
            :
            (status == DeploymentStatus.LOADING ?
                <div className="text-sm text-secondary">
                  {t('loading')}
                </div>
                :
                <div className="text-sm text-secondary">
                  {t('not_found')}
                </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function DeploymentInfo({deployment, project}: { deployment: FullDevProjectDeployment; project: DevProject }) {
  const t = useTranslations('DevProjectDeploymentPage');

  return (
    <div className="space-y-4">
      <div className="flex flex-row">
        <h1 className="text-lg font-medium">
          {t('title')}
        </h1>

        <div className="ml-auto flex flex-row gap-2">
          {deployment.active &&
            <LocaleNavLink href={`/project/${deployment.project_id}`} target="_blank">
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
                <DeleteDeploymentModal action={handleDeleteDeploymentForm.bind(null, deployment.id)}/>
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

        <DeploymentRevisionInfo status={deployment.status} revision={deployment.revision} project={project}/>
      </div>
    </div>
  )
}

export default async function DevProjectDeploymentPage({params}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectDeploymentPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const content = await remoteServiceApi.getDevProjectDeployment(params.deployment);
  if (!('id' in content)) {
    return redirect(`/dev/project/${params.project}/deployments`);
  }

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

      <DeploymentInfo deployment={content} project={project}/>
    </div>
  )
}