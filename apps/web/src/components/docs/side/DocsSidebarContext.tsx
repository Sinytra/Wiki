'use client'

import {createContext, useEffect, useState} from 'react';
import {usePathname} from "@/lib/locales/routing";

export type DocsSidebarType = 'left' | 'right' | 'none';

export interface DocsSidebarContext {
  open: DocsSidebarType;
  setOpen: (open: DocsSidebarType) => void;
}

export const DocsSidebarContext = createContext<DocsSidebarContext | null>(null);

export default function DocsSidebarContextProvider({children}: { children: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<DocsSidebarType>('none');

  useEffect(() => {
    if (open === 'none') {
      window.document.body.classList.remove('no-scroll');
    } else {
      window.document.body.classList.add('no-scroll');
    }
  }, [open]);

  useEffect(() => {
    setOpen('none');
  }, [pathname]);

  return (
    <DocsSidebarContext.Provider value={{open, setOpen}}>
      {children}
    </DocsSidebarContext.Provider>
  )
}