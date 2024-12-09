import * as React from "react";
import {Changelog} from "@/lib/docs/metadata";

function ChangelogEntry({version, date, changes}: { version: string; date?: string; changes: string[] }) {
  return (
    <div className="flex flex-row gap-4 h-full">
      <div className="relative min-h-max mt-1.5">
        <div
          className="w-3 h-3 bg-neutral-500 absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{content: ""}}/>
        <div className="mt-2 w-[3px] h-full bg-neutral-500 rounded-sm" style={{content: ""}}/>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row justify-between">
          <span className="text-primary font-semibold">
            Version {version}
          </span>
          {date &&
            <span className="text-muted-foreground">on {date}</span>
          }
        </div>
        <div className="ml-6">
          <ul className="list-disc">
            {changes.map((c, i) => (<li key={i}>{c}</li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function DocsEntryHistory({changelog}: { changelog: Changelog }) {
  return (
    <div className="flex flex-col gap-5 mx-4">
      {changelog.map(e => Object.entries(e).length === 1 ? Object.entries(e)[0] : e).map(e =>
        Array.isArray(e)
          ? (<div key={e[0]} className="flex flex-col gap-3">
            <ChangelogEntry version={e[0]} changes={[e[1] as string]}/>
          </div>)
          : (<div key={e.version} className="flex flex-col gap-3">
            <ChangelogEntry version={e.version} date={e.date} changes={e.changes as string[]}/>
          </div>)
      )}
    </div>
  );
}