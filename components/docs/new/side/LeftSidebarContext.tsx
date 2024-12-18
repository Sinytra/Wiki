'use client'

import {createContext, useState} from "react";

export interface SidebarContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const LeftSidebarContext = createContext<SidebarContext|null>(null);

export default function LeftSidebarContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(true);

  return (
    <LeftSidebarContext.Provider value={{open, setOpen}}>
      {children}
    </LeftSidebarContext.Provider>
  )
}