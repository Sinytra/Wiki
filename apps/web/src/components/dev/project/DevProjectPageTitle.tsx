import * as React from "react";
import {SidebarTrigger} from "@repo/ui/components/sidebar";

export default function DevProjectPageTitle({title, desc}: { title: string; desc: string; }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-row gap-2">
        <div className="sm:hidden">
          <SidebarTrigger className="mr-auto -ml-1 text-primary md:hidden"/>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium sm:text-xl">
            {title}
          </h3>
          <p className="text-sm text-secondary">
            {desc}
          </p>
        </div>
      </div>
      <hr className="border-primary"/>
    </div>
  )
}