'use client'

import {useState} from "react";
import {cn} from "@/lib/utils";

export default function ExpandableDescription({children}: { children?: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(true)} className={cn('bg-primary-alt/50 border border-secondary/50 rounded-sm p-4 pb-0', !expanded && 'hover:bg-secondary/20 cursor-pointer')}>
      <div className={cn(!expanded && 'masked-overflow overflow-hidden max-h-64')}>
        {children}
      </div>
    </div>
  )
}