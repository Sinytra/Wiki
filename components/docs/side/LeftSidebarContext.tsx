'use client'

import {createContext, useState} from "react";

export interface SidebarContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface LeftSidebarContext extends SidebarContext {
  folderStates: Record<string, boolean>;
  setFolderStates: (state: Record<string, boolean>) => void;
}

export const LeftSidebarContext = createContext<LeftSidebarContext|null>(null);

export default function LeftSidebarContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(true);
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>({});

  return (
    <LeftSidebarContext.Provider value={{open, setOpen, folderStates, setFolderStates}}>
      {children}
    </LeftSidebarContext.Provider>
  )
}