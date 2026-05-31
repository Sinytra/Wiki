'use client';

import {startTransition, useContext, useEffect, useRef} from 'react';
import {LocaleLink, useRouter} from '@/lib/locales/routing';
import {toast} from 'sonner';
import {Button} from '@repo/ui/components/button';
import {DevProjectSidebarContext} from '@/components/dashboard/dev/navigation/DevProjectSidebarContextProvider';
import {useTranslations} from 'next-intl';
import {DeploymentEvent} from '@sinytra/wiki-api-types';
import envPublic from '@repo/shared/envPublic';

interface Props {
  id: string;
}

export default function LiveProjectDeployConnection({id}: Props) {
  const initialized = useRef(false);
  const router = useRouter();
  const {setConnected} = useContext(DevProjectSidebarContext)!;
  const t = useTranslations('LiveProjectDeployConnection');

  useEffect(() => {
    const endpointUrl = envPublic.getBackendEndpointUrl() + '/api/v1/dev/deployments/events?global=true';
    const sse = new EventSource(endpointUrl, {withCredentials: true});

    let resolver: any = null;
    let rejector: any = null;
    const promise = new Promise((resolve, reject) => {
      resolver = () => resolve({});
      rejector = () => reject();
    });

    sse.onerror = console.error;

    sse.onopen = () => {
      console.debug('Opened SSE stream for deployment status');
    };

    sse.addEventListener('deployment', (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data) as DeploymentEvent;

        if (parsed.type == 'created') {
          setConnected(true);

          toast.promise(promise, {
            loading: t('loading'),
            success: t('success'),
            error: t('error'),
            action: (
              <LocaleLink href={`/dev/project/${id}/deployments/${parsed.deployment_id}`} className="ml-auto">
                <Button size="sm" variant="secondary" className="h-6! rounded-sm! text-[12px]!">
                  {t('view')}
                </Button>
              </LocaleLink>
            )
          });
        }

        // Finish
        if (parsed.type == 'success') {
          setConnected(false);
          if (resolver) resolver();
          startTransition(() => router.refresh());
        }
        if (parsed.type == 'error') {
          setConnected(false);
          if (rejector) rejector();
          startTransition(() => router.refresh());
        }
      } catch (e) {
        console.error('Error receiving SSE message', e);
      }
    });

    initialized.current = true;

    return () => {
      resolver = null;
      rejector = null;
      sse.close();
    };
  }, []);

  return null;
}