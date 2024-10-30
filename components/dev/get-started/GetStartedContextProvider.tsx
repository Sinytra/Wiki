'use client'

import {createContext, TransitionFunction, useState, useTransition} from "react";

export interface DevPageStarterContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  
  loading: boolean;
  startTransition: (loading: TransitionFunction) => void;
}

export const GetStartedContext = createContext<DevPageStarterContext|null>(null);

export default function GetStartedContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();

  return (
    <GetStartedContext.Provider value={{open, setOpen, loading, startTransition}}>
      {children}
    </GetStartedContext.Provider>
  )
}