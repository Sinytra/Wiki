'use client';

import MobileNavHamburger from '@/components/navigation/header/hamburger/MobileNavHamburger';
import MobileNavScreen from '@/components/navigation/header/MobileNavScreen';
import { useContext } from 'react';
import { MobileNavContext } from '@/components/docs/side/MobileNavContext';

export default function SubMobileNav({ children }: { children: any }) {
  const { open, setOpen } = useContext(MobileNavContext)!;

  return (
    <div className="pointer-events-auto! sm:hidden">
      <MobileNavHamburger
        active={open === 'project-nav'}
        setOpen={() => setOpen(open !== 'project-nav' ? 'project-nav' : 'none')}
      />
      <MobileNavScreen className="top-nav-height-ext bg-primary-alt" isVisible={open === 'project-nav'}>
        {children}
      </MobileNavScreen>
    </div>
  );
}
