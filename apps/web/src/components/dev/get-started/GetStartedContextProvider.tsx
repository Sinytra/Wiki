'use client'

import {createContext, useState} from "react";

export interface DevPageStarterContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const GetStartedContext = createContext<DevPageStarterContext|null>(null);

export default function GetStartedContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <GetStartedContext.Provider value={{open, setOpen}}>
      {children}
    </GetStartedContext.Provider>
  )
}