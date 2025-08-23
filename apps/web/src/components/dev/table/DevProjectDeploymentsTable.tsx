import * as React from "react";
import {GitCommitHorizontal, GlobeIcon, HardDriveUploadIcon, MoreHorizontal, ServerOffIcon} from "lucide-react";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger} from "@repo/ui/components/dropdown-menu";
import {Button} from "@repo/ui/components/button";
import {Badge} from "@repo/ui/components/badge";
import DeleteDeploymentModal from "../modal/DeleteDeploymentModal";
import {handleDeleteDeploymentForm} from "@/lib/forms/actions";
import {Link} from "@/lib/locales/routing";
import LocalDateTime from "@repo/ui/util/LocalDateTime";
import DeploymentStatusInfo from "@/components/dev/project/DeploymentStatusInfo";
import DeployProjectModalOpenButton from "@/components/dev/modal/DeployProjectModalOpenButton";
import {DeploymentStatus, DevProjectDeploymentRow, DevProjectDeployments} from "@repo/shared/types/api/deployment";
import ContextDropdownMenu from "@/components/util/ContextDropdownMenu";
import DataTablePagination from "@repo/ui/blocks/data-table/DataTablePagination";

function EmptyDeploymentsState() {
  return (
    <div className={`
      flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-sm border border-tertiary bg-primary-dim
      py-8
    `}>
      <div className="opacity-60">
        <ServerOffIcon className="size-12" />
      </div>

      <span className="text-lg font-medium">
        No deployments found
      </span>

      <span>
        Create a new deployment to publish your project on the wiki.
      </span>

      <div className="mt-2">
        <ClientLocaleProvider keys={['DeployProjectModal']}>
          <DeployProjectModalOpenButton />
        </ClientLocaleProvider>
      </div>
    </div>
  )
}

function DeploymentEntry({deployment}: { deployment: DevProjectDeploymentRow }) {
  return (
    <div className={`
      flex w-full flex-1 flex-col gap-3 rounded-sm bg-primary-dim p-4 hover:bg-primary sm:flex-row sm:items-center
      sm:gap-0 sm:rounded-none sm:p-3 sm:first:rounded-t-sm sm:last:rounded-b-sm
    `}>
      <div className="flex flex-2 flex-row items-center gap-2">
        <span className="font-mono text-sm">
          {deployment.id.substring(0, 9)}
        </span>

        {deployment.active &&
          <Badge variant="secondary" className={`border-[var(--vp-c-brand-1)] px-2 text-[var(--vp-c-brand-1)]`}>
              <GlobeIcon className="mr-2 size-3"/>
              Current
          </Badge>
        }
      </div>

      <DeploymentStatusInfo status={deployment.status}/>

      <div className="flex flex-3 flex-row gap-1">
        <GitCommitHorizontal width={20} height={20}/>
        <div className="flex flex-row gap-2">
          {deployment.commit_hash ?
            <>
              <span className="font-mono text-sm font-light">{deployment.commit_hash}</span>
              <span className="text-sm font-normal">{deployment.commit_message}</span>
            </>
            :
            <span className="text-sm text-secondary">
              N/A
            </span>
          }
        </div>
      </div>

      <div className="flex w-full flex-1 flex-row justify-between text-secondary sm:w-fit sm:justify-start">
        <LocalDateTime className="text-sm" form="LLL d, yyyy" dateTime={new Date(deployment.created_at)}/>

        <div className="flex flex-1 text-end text-sm">
          <span className="w-full">
            {deployment.user_id || '-'}
          </span>
        </div>
      </div>

      <div className="ml-4 hidden items-center sm:flex">
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
              />
            </ClientLocaleProvider>
          </>}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-7 p-0 focus-visible:ring-0">
              <span className="sr-only">
                Open
              </span>
              <MoreHorizontal className="w-5"/>
            </Button>
          </DropdownMenuTrigger>
        </ContextDropdownMenu>
      </div>
    </div>
  )
}

export default function DevProjectDeploymentsTable({data}: { data: DevProjectDeployments; page: number; }) {
  return (
    <div>
      {data.data.length > 0 ?
        <div className="flex border-collapse flex-col gap-2 rounded-sm border-secondary-dim sm:gap-0 sm:border">
          {...data.data.map(d => (
            <Link key={d.id} href={`deployments/${d.id}`} className={`
              rounded-sm border border-secondary-dim sm:rounded-none sm:border-0 sm:[&:not(:first-of-type)]:border-t
            `}>
              <DeploymentEntry deployment={d}/>
            </Link>
          ))}
        </div>
        :
        <EmptyDeploymentsState />
      }

      <ClientLocaleProvider keys={['DataTable']}>
        <DataTablePagination pages={data.pages}/>
      </ClientLocaleProvider>
    </div>
  )
}