'use client'

import {createContext, useState} from "react";

export interface SidebarContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RightSidebarContext = createContext<SidebarContext|null>(null);

export default function RightSidebarContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <RightSidebarContext.Provider value={{open, setOpen}}>
      {children}
    </RightSidebarContext.Provider>
  )
}