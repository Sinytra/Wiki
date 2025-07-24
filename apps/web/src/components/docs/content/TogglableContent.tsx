'use client'

import { useState } from "react";
import ToggleChevron from "@repo/ui/util/ToggleChevron";
import {cn} from "@repo/ui/lib/utils";

export default function TogglableContent({title, className, children}: { title: string; className?: string; children?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(className, 'w-full rounded-sm border border-secondary-dim')}>
      <button className="inline-flex w-full items-center justify-between bg-secondary p-2" onClick={() => setOpen(!open)}>
        <span className="font-medium">
          {title}
        </span>

        <ToggleChevron active={open} />
      </button>

      {open &&
        <div className="rounded-sm bg-primary-dim p-4">
          {children}
        </div>
      }
    </div>
  )
}