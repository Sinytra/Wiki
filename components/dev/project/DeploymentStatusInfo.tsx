import {DeploymentStatus} from "@/lib/service/remoteServiceApi";
import LoadingIndicator from "@/components/util/LoadingIndicator";
import * as React from "react";
import {useTranslations} from "next-intl";

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

export default function DeploymentStatusInfo({status}: { status: DeploymentStatus }) {
  const t = useTranslations('DeploymentStatus');

  return (
    <div className="flex flex-1 flex-row items-center gap-1">
      <DeploymentStatusIndicator status={status}/>
      <span className="flex-auto text-sm">
        {t(status)}
      </span>
    </div>
  )
}