'use client';

import MobileNavHamburger from '@/components/navigation/header/hamburger/MobileNavHamburger';
import MobileNavScreen from '@/components/navigation/header/MobileNavScreen';
import { useContext } from 'react';
import { MobileNavContext } from '@/components/docs/side/MobileNavContext';

export default function MobileNav({ children }: { children: any }) {
  const { open, setOpen } = useContext(MobileNavContext)!;

  return (
    <div className="sm:hidden">
      <MobileNavHamburger
        active={open === 'site-nav'}
        setOpen={() => setOpen(open !== 'site-nav' ? 'site-nav' : 'none')}
      />
      <MobileNavScreen className="top-nav-height bg-primary" isVisible={open === 'site-nav'}>
        {children}
      </MobileNavScreen>
    </div>
  );
}
