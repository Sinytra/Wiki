import {DeploymentStatus, DevProjectDeployment, DevProjectDeployments} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import {GitCommitHorizontal, GlobeIcon, HardDriveUploadIcon, MoreHorizontal} from "lucide-react";
import {format, parseISO} from "date-fns";
import DataTablePagination from "@/components/base/data-table/DataTablePagination";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import LoadingIndicator from "@/components/util/LoadingIndicator";
import {useTranslations} from "next-intl";
import DeleteDeploymentModal from "../modal/DeleteDeploymentModal";
import {handleDeleteDeploymentForm} from "@/lib/forms/actions";
import ContextDropdownMenu from "@/components/ui/custom/ContextDropdownMenu";

function DeploymentStatusIndicator({status}: { status: DeploymentStatus }) {
  return (
    <>
      {status == DeploymentStatus.UNKNOWN &&
        <div className="flex w-5 justify-center">
            <div className="size-2.5 rounded-full bg-neutral-400"/>
        </div>
      }
      {status == DeploymentStatus.CREATED &&
        <div className="flex w-5 justify-center">
            <div className="size-2.5 rounded-full bg-blue-400"/>
        </div>
      }
      {status == DeploymentStatus.LOADING &&
        <LoadingIndicator/>
      }
      {status == DeploymentStatus.SUCCESS &&
        <div className="flex w-5 justify-center">
            <div className="size-2.5 rounded-full bg-green-400"/>
        </div>
      }
      {status == DeploymentStatus.ERROR &&
        <div className="flex w-5 justify-center">
            <div className="size-2.5 rounded-full bg-destructive"/>
        </div>
      }
    </>
  )
}

function DeploymentStatusInfo({status}: { status: DeploymentStatus }) {
  const t = useTranslations('DeploymentStatus');

  return (
    <div className="flex flex-1 flex-row items-center gap-2">
      <DeploymentStatusIndicator status={status}/>
      <span className="flex-auto text-sm">
        {t(status)}
      </span>
    </div>
  )
}

function DeploymentEntry({deployment}: { deployment: DevProjectDeployment }) {
  return (
    <div className={`
      flex w-full flex-1 flex-row items-center border-secondary bg-primary-dim p-3 first:rounded-t-sm last:rounded-b-sm
      hover:bg-primary [&:not(:first-of-type)]:border-t
    `}>
      <div className="flex flex-2 flex-row items-center gap-2">
        <span className="font-mono text-sm">
          {deployment.id.substring(0, 9)}
        </span>

        {deployment.current &&
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

      {/* TODO Make local */}
      <time dateTime={deployment.created_at} className="flex flex-1 text-sm">
        {format(parseISO(deployment.created_at), 'LLL d, yyyy')}
      </time>

      <div className="flex flex-1 text-end text-sm">
        <span className="w-full">
          {deployment.user_id || '-'}
        </span>
      </div>

      <div className="ml-4 flex items-center">
        <ContextDropdownMenu
          content={<>
            <DropdownMenuLabel>
              Actions
            </DropdownMenuLabel>

            <DropdownMenuItem disabled>
              <span className="flex flex-row items-center">
                <HardDriveUploadIcon className="mr-2 size-3"/>
                Make current
              </span>
            </DropdownMenuItem>

            <ClientLocaleProvider keys={['DeleteDeploymentModal']}>
              <DeleteDeploymentModal action={handleDeleteDeploymentForm.bind(null, deployment.id)}/>
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
        <div className="flex border-collapse flex-col rounded-sm border border-secondary">
          {...data.data.map(d => (
            <DeploymentEntry deployment={d} key={d.id}/>
          ))}
        </div>
        :
        <div>
          {/* TODO */}
          No deployments found.
        </div>
      }

      <ClientLocaleProvider keys={['DataTable']}>
        <DataTablePagination pages={data.pages}/>
      </ClientLocaleProvider>
    </div>
  )
}