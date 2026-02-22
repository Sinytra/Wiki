import * as React from "react";
import {SidebarTrigger} from "@repo/ui/components/sidebar";

interface Properties {
  title: string;
  desc: string;
  icon?: any;
}

export default function DevProjectPageTitle({title, desc, icon: Icon}: Properties) {
  return (
    <div className="space-y-3">
      <div className="flex flex-row gap-2">
        <div className="sm:hidden">
          <SidebarTrigger className="mr-auto -ml-1 text-primary md:hidden"/>
        </div>
        <div className="space-y-1">
          <h3 className="flex flex-row items-center gap-2 text-lg font-medium sm:text-xl">
            {Icon && <Icon className="size-5" />}
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