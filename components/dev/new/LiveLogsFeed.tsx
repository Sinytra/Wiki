'use client'

import {Project} from "@/lib/service";
import {PlugIcon} from "lucide-react";
import {useEffect} from "react";

export default function LiveLogsFeed({project}: { project: Project }) {
  // TODO WSS

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/feed/' + project.id);

    ws.onerror = console.error;

    ws.onopen = () => {
      console.log('opened WS connection for project', project.id);
    }

    ws.onmessage = (data: MessageEvent<any>) => {
      console.log('received: %s', data.data);
    };
  }, []);

  return (
    <div>
      <PlugIcon className="w-4 h-4" />
    </div>
  )
}