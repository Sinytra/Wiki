'use client'

import {Button} from "@/components/ui/button";
import {startTransition, Suspense, use, useEffect, useRef, useState} from 'react';
import {LoaderCircleIcon, ScrollTextIcon} from "lucide-react";

import LogLang from '@shikijs/langs/log';
import GitHubDarkDefault from '@shikijs/themes/github-dark-default';
import {createHighlighterCore, makeSingletonHighlighterCore} from 'shiki/core';
import {createOnigurumaEngine} from 'shiki/engine/oniguruma';
import {ProjectStatus} from "@/lib/types/serviceTypes";
import {useRouter} from "@/lib/locales/routing";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

const WS_SUCCESS = '<<success';
const WS_ERROR = '<<error';

function Skeleton({children}: { children: any }) {
  return (
    <div
      className="text-secondary w-full rounded-md flex flex-col gap-3 justify-center items-center h-72 bg-[#0d1117]">
      {children}
    </div>
  )
}

function RenderedLogBody({body}: { body: string }) {
  return (
    <div
      className="[&>pre]:slim-scrollbar-scrollbar-primary [&>pre]:overflow-y-auto [&>pre]:h-72 [&>pre]:p-2 [&>pre]:rounded-md [&>pre]:text-xs"
      dangerouslySetInnerHTML={({__html: body})}>
    </div>
  )
}

function LogBody({body}: { body: Promise<string | null> }) {
  const t = useTranslations('DevProjectLogs');
  const html = use(body);

  return (html !== null ? <RenderedLogBody body={html}/> : <Skeleton>{t('error')}</Skeleton>);
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

const getHighlighter = makeSingletonHighlighterCore(createHighlighterCore);

export default function DevProjectLogs({id, status, token, callback}: {
  id: string;
  status: ProjectStatus;
  token: string;
  callback: (id: string) => Promise<string | undefined>;
}) {
  const t = useTranslations('DevProjectLogs');
  const [lines, setLines] = useState<string[]>([]);
  const [renderedLogs, setRenderedLogs] = useState<string | undefined>(undefined);
  const [logPromise, setLogPromise] = useState<Promise<string | null> | undefined>(undefined);

  const router = useRouter();

  const getHighlighterInstance = () => getHighlighter({
    langs: [LogLang],
    themes: [GitHubDarkDefault],
    engine: createOnigurumaEngine(import('shiki/wasm'))
  });

  function onClick() {
    setLogPromise(callback(id).then(result => {
      return result !== undefined ? getHighlighterInstance().then(r => {
        return r.codeToHtml(result.length === 0 ? '(empty)' : result, {
          lang: 'log',
          theme: 'github-dark-default'
        });
      }) : null;
    }))
  }

  useEffect(() => {
    if (lines.length === 0) {
      setRenderedLogs(undefined);
      return;
    }

    getHighlighterInstance().then(r => {
      setRenderedLogs(r.codeToHtml(lines.join(''), {
        lang: 'log',
        theme: 'github-dark-default'
      }));
    })
  }, [lines]);

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
      setRenderedLogs(undefined);
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data.startsWith('<<')) {
        if (data.data === WS_SUCCESS) {
          toast.success(t('toast.success'));
        }
        if (data.data === WS_ERROR) {
          toast.error(t('toast.error'));
        }
        keepLogs.current = true;
        return;
      }
      setLines((v) => [...v, data.data]);
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <ScrollTextIcon className="w-4 h-4"/>
          <span>
            {t('title')}
          </span>
          {wsOpen &&
            <div className="ml-1 inline-flex items-center rounded-full p-1 bg-green-900 text-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          }
        </div>
      </div>
      <div className="mt-2">
        {renderedLogs ? <RenderedLogBody body={renderedLogs}/> :
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