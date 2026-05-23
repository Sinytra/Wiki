import * as React from 'react';
import {useTranslations} from 'next-intl';
import {DeploymentStatus} from '@sinytra/wiki-api-types';
import LoadingIndicator from '@repo/ui/components/indicator/LoadingIndicator';

function DeploymentStatusIndicator({status}: { status: DeploymentStatus }) {
  return (
    <>
      {status == 'created' &&
        <div className="flex w-5 justify-center">
          <div className="size-2.5 rounded-full bg-blue-400"/>
        </div>
      }
      {status == 'loading' &&
        <LoadingIndicator/>
      }
      {status == 'success' &&
        <div className="flex w-5 justify-center">
          <div className="size-2.5 rounded-full bg-green-400"/>
        </div>
      }
      {status == 'error' &&
        <div className="flex w-5 justify-center">
          <div className="size-2.5 rounded-full bg-destructive"/>
        </div>
      }
    </>
  );
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
  );
}