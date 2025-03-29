'use client'

import {createContext, useState} from "react";

export interface DevSidebarContextState {
  connected: boolean;
  setConnected: (open: boolean) => void;
}

export const DevProjectSidebarContext = createContext<DevSidebarContextState|null>(null);

export default function DevProjectSidebarContextProvider({ children }: { children: any }) {
  const [connected, setConnected] = useState(false);

  return (
    <DevProjectSidebarContext.Provider value={{connected, setConnected}}>
      {children}
    </DevProjectSidebarContext.Provider>
  )
}