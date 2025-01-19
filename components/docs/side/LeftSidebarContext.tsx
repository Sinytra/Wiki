'use client'

import {createContext, useState} from 'react';

export interface SidebarContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface LeftSidebarContext extends SidebarContext {
  folderStates: Record<number, string>;
  setFolderStates: (state: Record<number, string>) => void;
}

export const LeftSidebarContext = createContext<LeftSidebarContext|null>(null);

export default function LeftSidebarContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);
  const [folderStates, setFolderStates] = useState<Record<number, string>>({});

  return (
    <LeftSidebarContext.Provider value={{open, setOpen, folderStates, setFolderStates}}>
      {children}
    </LeftSidebarContext.Provider>
  )
}