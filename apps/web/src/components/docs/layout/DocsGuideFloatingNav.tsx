'use client';

import { useContext } from 'react';
import DocsFloatingNav, { FloatingNavButton } from '@/components/docs/layout/DocsFloatingNav';
import { MenuIcon } from 'lucide-react';
import { MobileNavContext } from '@/components/docs/side/MobileNavContext';

export default function DocsGuideFloatingNav() {
  const { open, setOpen } = useContext(MobileNavContext)!;

  return (
    <DocsFloatingNav>
      <FloatingNavButton
        icon={MenuIcon}
        className="lg:hidden"
        open={open === 'file-tree'}
        setOpen={(o) => setOpen(o ? 'file-tree' : 'none')}
      />
    </DocsFloatingNav>
  );
}
