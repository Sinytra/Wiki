'use client'

import * as React from "react";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {ChevronDown} from "lucide-react";
import {usePathname} from "@/lib/locales/routing";

export default function DirectoryTreeView({level, newBasePath, trigger, children}: {
  level: number;
  newBasePath: string;
  trigger: any;
  children?: any;
}) {
  const currentPath = usePathname().split('/').slice(4).join('/');
  const isDefaultOpen = currentPath.length > 0 && currentPath.startsWith(newBasePath.substring(1) + '/');

  const [isOpen, setOpen] = useState(isDefaultOpen);

  return (
    <div className={cn("[&:not(:last-child)_.docsAccordeonTrigger]:border-b accordion", isOpen && 'open')} style={{paddingLeft: `${((level - 1) * 0.4)}rem`}}>
      <div className="border-b !border-none">
        <h3 className="flex">
          <button onClick={() => setOpen(!isOpen)}
                  className="border-b docsAccordeonTrigger flex flex-1 items-center justify-between py-4 font-medium hover:underline [&[data-state=open]>svg]:rotate-180 docsAccordeonTrigger px-1 capitalize border-accent [&_svg]:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 transition-none">
            {trigger}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200"/>
          </button>
        </h3>
        <div className="accordion-body overflow-hidden text-sm">
          <div className="pt-0">
            <div className="pb-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}