'use client'

import {useContext} from "react";
import {DocsSidebarContext} from "@/components/docs/side/DocsSidebarContext";
import {Info, Menu, X} from "lucide-react";

export default function ProjectDocsMobileHeader({children}: {children: any}) {
  const {open, setOpen} = useContext(DocsSidebarContext)!;

  return (
    <header className="lg:hidden w-full flex justify-between items-center px-0 pt-1 pb-2 border-b border-tertiary">
      <button onClick={() => setOpen(open == 'left' ? 'none' : 'left')} className="text-primary">
        {open === 'left' ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <h1 className="text-lg font-bold">
        {children}
      </h1>
      <button onClick={() => setOpen(open == 'right' ? 'none' : 'right')} className="text-primary">
        {open === 'right' ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
      </button>
    </header>
  )
}