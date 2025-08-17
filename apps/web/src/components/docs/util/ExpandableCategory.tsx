'use client'

import {useState} from "react";
import * as React from "react";
import ToggleChevron from "@repo/ui/util/ToggleChevron";

export default function ExpandableCategory({name, children}: { name: string; children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <tr>
      <td>
        <div className="mb-0! w-full border-separate [&_td]:border-none">
          <div className={`
            flex w-full cursor-pointer flex-row items-center rounded-sm border-none bg-primary-dim p-1.5 px-2
            select-none hover:bg-secondary/50
          `}
               onClick={() => setOpen(!open)} data-state={open ? 'open' : 'closed'}
          >
            <div className="mx-auto flex w-full justify-center text-center font-medium">
              {name}
            </div>
            <div className="w-8">
              <ToggleChevron className="ml-auto h-4 w-4" active={open} />
            </div>
          </div>

          {open &&
            <div className="mt-2 flex w-full flex-col rounded-md">
            {children}
            </div>
          }
        </div>
      </td>
    </tr>
  )
}