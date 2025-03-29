'use client'

import {ProjectStatus} from "@/lib/types/serviceTypes";
import {startTransition, useContext, useEffect, useRef} from "react";
import {Link, useRouter} from "@/lib/locales/routing";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {DevProjectSidebarContext} from "@/components/dev/project/DevProjectSidebarContextProvider";

interface Props {
  id: string;
  status: ProjectStatus;
  token: string
}

export default function LiveProjectConnection({id, status, token}: Props) {
  const initialized = useRef(false);
  const router = useRouter();
  const {connected, setConnected} = useContext(DevProjectSidebarContext)!;

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

      toast.promise(promise, {
        loading: 'Reloading project...',
        success: 'Project reload successful',
        error: 'Error reloading project',
        action: (
          <Link href={`/dev/project/${id}/health`} className="ml-auto">
            <Button size="sm" variant="secondary" className="rounded-sm! text-[12px]! h-6!">
              View logs
            </Button>
          </Link>
        )
      });
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data == '<<error' && rejector) {
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