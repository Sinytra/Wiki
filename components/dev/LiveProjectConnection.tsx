'use client'

import {ProjectStatus} from "@/lib/types/serviceTypes";
import {startTransition, useEffect, useRef} from "react";
import {useRouter} from "@/lib/locales/routing";
import {toast} from "sonner";

interface Props {
  id: string;
  status: ProjectStatus;
  token: string
}

export default function LiveProjectConnection({id, status, token}: Props) {
  const initialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (status != ProjectStatus.LOADING || initialized.current) {
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

      toast.promise(promise, {
        loading: 'Reloading project...',
        success: 'Project reload successful',
        error: 'Error reloading project'
      });
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data == '<<error' && rejector) {
        rejector();
      }
    };

    ws.onclose = () => {
      console.debug('Closed WS connection for project', id);
      if (resolver) resolver();
      initialized.current = false;
      startTransition(() => router.refresh());
    }

    initialized.current = true;
  }, [status]);

  return null;
}