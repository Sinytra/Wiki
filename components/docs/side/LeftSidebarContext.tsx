'use client'

import {createContext, useState} from 'react';

export interface SidebarContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface LeftSidebarContext extends SidebarContext {
  folderStates: Record<number, string>;
  setFolderStates: (state: Record<number, string>) => void;

  scrollPos: number;
  setScrollPos: (scrollPos: number) => void;
}

export const LeftSidebarContext = createContext<LeftSidebarContext|null>(null);

export default function LeftSidebarContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);
  const [folderStates, setFolderStates] = useState<Record<number, string>>({});
  const [scrollPos, setScrollPos] = useState<number>(0);

  return (
    <LeftSidebarContext.Provider value={{open, setOpen, folderStates, setFolderStates, scrollPos, setScrollPos}}>
      {children}
    </LeftSidebarContext.Provider>
  )
}