import * as React from "react";
import {SidebarTrigger} from "@/components/ui/sidebar";

export default function DevProjectPageTitle({title, desc}: { title: string; desc: string; }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-row gap-2">
        <div className="sm:hidden">
          <SidebarTrigger className="-ml-1 mr-auto md:hidden text-primary"/>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-medium">
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