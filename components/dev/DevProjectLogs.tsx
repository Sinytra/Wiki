'use client'

import {Button} from "@/components/ui/button";
import {startTransition, Suspense, use, useEffect, useRef, useState} from 'react';
import {LoaderCircleIcon, ScrollTextIcon} from "lucide-react";

import {ProjectStatus} from "@/lib/types/serviceTypes";
import {useRouter} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import highlighter from "@/lib/markdown/highlighter";
import DevProjectSectionTitle from "@/components/dev/DevProjectSectionTitle";
import ConnectionIndicator from "@/components/util/ConnectionIndicator";

function Skeleton({children}: { children: any }) {
  return (
    <div
      className="text-secondary w-full rounded-md flex flex-col gap-3 justify-center items-center h-80 bg-[#0d1117]">
      {children}
    </div>
  )
}

function RenderedLogBody({lines}: { lines: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const child = container?.firstElementChild;
    if (child) {
      child.scrollTop = child.scrollHeight - 1;
    }
  });

  return (
    <div ref={containerRef} className="bg-[#0d1117] slim-scrollbar">
      <pre className="text-xs slim-scrollbar slim-scrollbar-scrollbar-primary overflow-y-auto h-80 p-2 rounded-md">
        {...lines.map((s, i) => (
          <p key={i}>
            {highlighter.highlightLine(s)}
          </p>
        ))}
      </pre>
    </div>
  )
}

function LogBody({body}: { body: Promise<string | undefined> }) {
  const t = useTranslations('DevProjectLogs');
  const lines = use(body)?.split('\n');

  return (lines ? <RenderedLogBody lines={lines}/> : <Skeleton>{t('error')}</Skeleton>);
}

function LoadingLogs() {
  const t = useTranslations('DevProjectLogs');

  return (
    <Skeleton>
      <span className="text-xl">
        {t('loading')}
      </span>
      <LoaderCircleIcon className="mt-4 h-7 w-7 animate-spin"/>
    </Skeleton>
  )
}

function NoLogs({children}: { children: any }) {
  const t = useTranslations('DevProjectLogs');

  return (
    <Skeleton>
      <span className="text-xl">
        {t('unloaded')}
      </span>
      {children}
    </Skeleton>
  )
}

function WaitingLogs() {
  const t = useTranslations('DevProjectLogs');

  return (
    <Skeleton>
      <span>
        {t('waiting')}
      </span>
    </Skeleton>
  )
}

export default function DevProjectLogs({id, status, token, callback}: {
  id: string;
  status: ProjectStatus;
  token?: string;
  callback: (id: string) => Promise<string | undefined>;
}) {
  const t = useTranslations('DevProjectLogs');
  const [lines, setLines] = useState<string[] | undefined>(undefined);
  const [logPromise, setLogPromise] = useState<Promise<string | undefined> | undefined>(undefined);

  const router = useRouter();

  function onClick() {
    setLogPromise(callback(id));
  }

  const initialized = useRef(false);
  const keepLogs = useRef(false);
  const oldStatus = useRef(status);
  const [wsOpen, setWsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Reset logs when changing project settings, but not after revalidating
    if (!keepLogs.current && status != oldStatus.current) {
      setLines([]);
      setLogPromise(undefined);
      oldStatus.current = status;
    } else if (keepLogs.current) {
      keepLogs.current = false;
    }

    if (status != ProjectStatus.LOADING || initialized.current) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL) {
      return;
    }

    const endpointUrl = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    const ws = new WebSocket(`${endpointUrl}/ws/api/v1/project/log/${id}?token=${token}`);

    ws.onerror = console.error;

    ws.onopen = () => {
      console.debug('Opened WS connection for project', id);
      setWsOpen(true);
      setLines([]);
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data.startsWith('<<')) {
        keepLogs.current = true;
        return;
      }
      setLines((v) => [...(v ?? []), data.data]);
    };

    ws.onclose = () => {
      console.debug('Closed WS connection for project', id);
      setWsOpen(false);
      initialized.current = false;
      startTransition(() => router.refresh());
    }

    initialized.current = true;
  }, [status]);

  return (
    <div className="flex flex-col gap-4">
      <DevProjectSectionTitle title={t('title')} desc="Server-side project log" icon={ScrollTextIcon}
                              ping={wsOpen && <ConnectionIndicator className="ml-1" />}
      />

      <div>
        {lines ? <RenderedLogBody lines={lines}/> :
          wsOpen ? <WaitingLogs/>
            : logPromise ?
              <Suspense fallback={<LoadingLogs/>}>
                <LogBody body={logPromise}/>
              </Suspense>
              :
              <NoLogs>
                <Button size="sm" className="h-8!" variant="outline" onClick={onClick}>
                  {t('show')}
                </Button>
              </NoLogs>
        }
      </div>
    </div>
  )
}