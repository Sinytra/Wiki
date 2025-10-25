'use client'

import {createContext, useState} from "react";

export interface DeployProjectContextState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeployProjectContext = createContext<DeployProjectContextState|null>(null);

export default function DeployProjectContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <DeployProjectContext.Provider value={{open, setOpen}}>
      {children}
    </DeployProjectContext.Provider>
  )
}