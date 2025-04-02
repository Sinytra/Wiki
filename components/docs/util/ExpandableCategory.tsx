'use client'

import {useState} from "react";
import {ChevronDown} from "lucide-react";
import * as React from "react";
import ToggleChevron from "@/components/util/ToggleChevron";

export default function ExpandableCategory({name, children}: { name: string; children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <tr>
      <td>
        <div className="w-full mb-0! [&_td]:border-none border-separate">
          <div className="w-full bg-primary-dim border-none
                          flex flex-row items-center p-1.5 px-2
                        hover:bg-secondary/50 rounded-sm cursor-pointer select-none"
               onClick={() => setOpen(!open)} data-state={open ? 'open' : 'closed'}
          >
            <div className="mx-auto flex justify-center w-full text-center font-medium">
              {name}
            </div>
            <div className="w-8">
              <ToggleChevron className="ml-auto h-4 w-4" active={open} />
            </div>
          </div>

          {open &&
            <div className="w-full mt-2 flex flex-col rounded-md">
            {children}
            </div>
          }
        </div>
      </td>
    </tr>
  )
}