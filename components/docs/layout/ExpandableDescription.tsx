'use client'

import {useState} from "react";
import {cn} from "@/lib/utils";

export default function ExpandableDescription({children}: { children?: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(true)} className={cn('relative bg-primary-alt/50 border border-secondary-dim rounded-sm p-4 pb-0', !expanded && 'hover:bg-secondary/20 cursor-pointer')}>
      {!expanded &&
        <span className="absolute text-sm top-0 right-0 m-3 text-secondary">
            Click to expand
        </span>
      }
      <div className={cn(!expanded && 'masked-overflow overflow-hidden max-h-64')}>
        {children}
      </div>
    </div>
  )
}