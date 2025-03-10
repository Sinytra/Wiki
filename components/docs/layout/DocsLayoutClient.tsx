"use client";

import {ReactNode, useContext} from "react";
import {Info, Menu, X} from "lucide-react";
import {DocsSidebarContext} from "@/components/docs/side/DocsSidebarContext";

interface DocsLayoutClientProps {
  title: string;
  children: ReactNode;
}

function MobileHeader({title}: {title: string}) {
  const {open, setOpen} = useContext(DocsSidebarContext)!;

  return (
    <header className="lg:hidden flex justify-between items-center p-4 border-b border-border">
      <button onClick={() => setOpen(open == 'left' ? 'none' : 'left')} className="text-primary">
        {open === 'left' ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <h1 className="text-lg font-bold">
        {title}
      </h1>
      <button onClick={() => setOpen(open == 'right' ? 'none' : 'right')} className="text-primary">
        {open === 'right' ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
      </button>
    </header>
  )
}

export default function DocsLayoutClient({title, children}: DocsLayoutClientProps) {
  return (
    <div className="flex flex-col flex-1 bg-primary text-primary">
      {/* Header */}
      <MobileHeader title={title} />

      {children}
    </div>
  );
}