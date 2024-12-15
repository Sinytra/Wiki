"use client";

import {ReactNode, useContext} from "react";
import {LeftSidebarContext} from "@/components/docs/new/side/LeftSidebarContext";
import {RightSidebarContext} from "@/components/docs/new/side/RightSidebarContext";
import {Info, Menu, X} from "lucide-react";

interface DocsLayoutClientProps {
  title: string;
  children: ReactNode;
}

function MobileHeader({title}: {title: string}) {
  const {open: leftOpen, setOpen: setLeftOpen} = useContext(LeftSidebarContext)!;
  const {open: rightOpen, setOpen: setRightOpen} = useContext(RightSidebarContext)!;

  return (
    <header className="lg:hidden flex justify-between items-center p-4 border-b border-border">
      <button onClick={() => setLeftOpen(!leftOpen)} className="text-foreground">
        {leftOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <h1 className="text-lg font-bold">
        {title}
      </h1>
      <button onClick={() => setRightOpen(!rightOpen)} className="text-foreground">
        {rightOpen ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
      </button>
    </header>
  )
}

export default function DocsLayoutClient({title, children}: DocsLayoutClientProps) {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Header */}
      <MobileHeader title={title} />

      {children}
    </div>
  );
}