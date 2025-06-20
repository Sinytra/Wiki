'use client'

import {useContext} from "react";
import {DocsSidebarContext} from "@/components/docs/side/DocsSidebarContext";
import {Info, Menu, X} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";

interface Props {
  showRightSidebar?: boolean;
  children?: any
}

export default function ProjectDocsMobileHeader({showRightSidebar, children}: Props) {
  const {open, setOpen} = useContext(DocsSidebarContext)!;

  return (
    <header className="flex w-full items-center justify-between border-b border-tertiary px-0 pt-1 pb-2 lg:hidden">
      <button onClick={() => setOpen(open == 'left' ? 'none' : 'left')} className="text-primary">
        {open === 'left' ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      <h1 className="text-lg font-bold">
        {children}
      </h1>
      <button onClick={() => setOpen(open == 'right' ? 'none' : 'right')}
              className={cn('text-primary', showRightSidebar === false && 'invisible')}
      >
        {open === 'right' ? <X className="h-6 w-6" /> : <Info className="h-6 w-6" />}
      </button>
    </header>
  )
}