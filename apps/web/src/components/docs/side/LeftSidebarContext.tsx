'use client';

import { createContext, useState } from 'react';

export interface LeftSidebarContext {
  folderStates: Record<number, string>;
  setFolderStates: (state: Record<number, string>) => void;

  scrollPos: number;
  setScrollPos: (scrollPos: number) => void;
}

export const LeftSidebarContext = createContext<LeftSidebarContext | null>(null);

export default function LeftSidebarContextProvider({ children }: { children: any }) {
  const [folderStates, setFolderStates] = useState<Record<number, string>>({});
  const [scrollPos, setScrollPos] = useState<number>(0);

  return (
    <LeftSidebarContext.Provider
      value={{
        folderStates,
        setFolderStates,
        scrollPos,
        setScrollPos
      }}
    >
      {children}
    </LeftSidebarContext.Provider>
  );
}
