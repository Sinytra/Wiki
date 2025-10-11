'use client'

import {useState} from "react";
import {cn} from "@repo/ui/lib/utils";

export default function ExpandableDescription({children}: { children?: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(true)} className={cn(`
      group relative rounded-sm border border-secondary-dim bg-primary-alt/50 p-4 pb-0
    `, !expanded && `cursor-pointer hover:bg-secondary/20`)}>
      {!expanded &&
        <span className="absolute top-0 right-0 z-50 m-3 hidden text-sm text-secondary group-hover:block">
            Click to expand
        </span>
      }
      <div className={cn(!expanded && 'masked-overflow max-h-64 overflow-hidden', 'min-h-64')}>
        {children}
      </div>
    </div>
  )
}