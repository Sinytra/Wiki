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

function Skeleton({children}: { children: any }) {
  return (
    <div
      className="text-muted-foreground w-full rounded-md flex flex-col gap-3 justify-center items-center h-72 bg-[#0d1117]">
      {children}
    </div>
  )
}

function RenderedLogBody({body}: { body: string }) {
  return (
    <div
      className="[&>pre]:slim-scrollbar-muted [&>pre]:overflow-y-auto [&>pre]:h-72 [&>pre]:p-2 [&>pre]:rounded-md [&>pre]:text-xs"
      dangerouslySetInnerHTML={({__html: body})}>
    </div>
  )
}

function LogBody({body}: { body: Promise<string | null> }) {
  const html = use(body);

  return (html !== null ? <RenderedLogBody body={html}/>
      : <Skeleton>Error loading logs</Skeleton>
  );
}

function LoadingLogs() {
  return (
    <Skeleton>
      <span className="text-xl">
        Loading...
      </span>
      <LoaderCircleIcon className="mt-4 h-7 w-7 animate-spin"/>
    </Skeleton>
  )
}

function NoLogs({children}: { children: any }) {
  return (
    <Skeleton>
      <span className="text-xl">
        Not loaded
      </span>
      {children}
    </Skeleton>
  )
}

function WaitingLogs() {
  return (
    <Skeleton>
      <span>Waiting for server...</span>
    </Skeleton>
  )
}

const getHighlighter = makeSingletonHighlighterCore(createHighlighterCore);

export default function ProjectLogs({id, status, hashedToken, callback}: {
  id: string;
  status: ProjectStatus;
  hashedToken: string;
  callback: (id: string) => Promise<string | undefined>;
}) {
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
  const [wsOpen, setWsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (status != ProjectStatus.LOADING || initialized.current) {
      return;
    }

    const ws = new WebSocket(`ws://localhost:8080/ws/api/v1/project/log/${id}?token=${hashedToken}`);

    ws.onerror = console.error;

    ws.onopen = () => {
      console.debug('Opened WS connection for project', id);
      setWsOpen(true);
      setLines([]);
      setRenderedLogs(undefined);
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      if (data.data.startsWith('<<')) {
        if (data.data === '<<success') { // TODO
          toast.success('Project setup complete');
        }
        if (data.data === '<<complete') {
          startTransition(() => router.refresh());
        }
        return;
      }
      setLines((v) => [...v, data.data]);
    };

    ws.onclose = () => {
      console.debug('Closed WS connection for project', id);
      setWsOpen(false);
      initialized.current = false;
    }

    initialized.current = true;
  }, [status]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <ScrollTextIcon className="w-4 h-4"/>
          <span>Server logs</span>
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
                <Button size="sm" className="!h-8" variant="outline" onClick={onClick}>
                  Show
                </Button>
              </NoLogs>
        }
      </div>
    </div>
  )
}