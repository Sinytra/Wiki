'use client';

import { createContext, useEffect, useState } from 'react';
import { usePathname } from '@/lib/locales/routing';

export type NavMenuType = 'file-tree' | 'search' | 'project-nav' | 'site-nav' | 'none';

export interface MobileNavContext {
  open: NavMenuType;
  setOpen: (open: NavMenuType) => void;
}

export const MobileNavContext = createContext<MobileNavContext | null>(null);

export default function MobileNavContextProvider({ children }: { children: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<NavMenuType>('none');

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

  return <MobileNavContext.Provider value={{ open, setOpen }}>{children}</MobileNavContext.Provider>;
}
