'use client'

import {startTransition, useContext, useEffect, useRef} from "react";
import {Link, useRouter} from "@/lib/locales/routing";
import {toast} from "sonner";
import {Button} from "@repo/ui/components/button";
import {DevProjectSidebarContext} from "@/components/dev/navigation/DevProjectSidebarContextProvider";
import {useTranslations} from "next-intl";
import {ProjectStatus} from "@repo/shared/types/api/project";

interface Props {
  id: string;
  status: ProjectStatus;
  token: string
}

const WS_HELLO = '<<hello<<';
const WS_ERROR = '<<error';

export default function LiveProjectDeployConnection({id, status, token}: Props) {
  const initialized = useRef(false);
  const router = useRouter();
  const {connected, setConnected} = useContext(DevProjectSidebarContext)!;
  const t = useTranslations('LiveProjectDeployConnection');

  useEffect(() => {
    if (connected || status != ProjectStatus.LOADING || initialized.current) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
      return;
    }

    const endpointUrl = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    const ws = new WebSocket(`${endpointUrl}/ws/api/v1/project/log/${id}?token=${token}`);

    let resolver: any = null;
    let rejector: any = null;
    const promise = new Promise((resolve, reject) => {
      resolver = () => resolve({});
      rejector = () => reject();
    });

    ws.onerror = console.error;

    ws.onopen = () => {
      console.debug('Opened WS connection for project', id);
      setConnected(true);
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data.startsWith(WS_HELLO)) {
        const deploymentId = data.data.substring(WS_HELLO.length);

        toast.promise(promise, {
          loading: t('loading'),
          success: t('success'),
          error: t('error'),
          action: (
            <Link href={`/dev/project/${id}/deployments/${deploymentId}`} className="ml-auto">
              <Button size="sm" variant="secondary" className="h-6! rounded-sm! text-[12px]!">
                {t('view')}
              </Button>
            </Link>
          )
        });
      }
      if (data.data == WS_ERROR && rejector) {
        rejector();
      }
    };

    ws.onclose = () => {
      console.debug('Closed WS connection for project', id);
      setConnected(false);
      if (resolver) resolver();
      initialized.current = false;
      startTransition(() => router.refresh());
    }

    initialized.current = true;
  }, [status]);

  return null;
}