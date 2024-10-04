'use client'

import {createContext, useState} from "react";

export const GetStartedContext = createContext<{open: boolean, setOpen: (v: boolean) => void}|null>(null);

export default function GetStartedContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <GetStartedContext.Provider value={{open, setOpen}}>
      {children}
    </GetStartedContext.Provider>
  )
}