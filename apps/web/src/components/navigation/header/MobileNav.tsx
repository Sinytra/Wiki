'use client'

import MobileNavHamburger from "@/components/navigation/header/hamburger/MobileNavHamburger";
import MobileNavScreen from "@/components/navigation/header/MobileNavScreen";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export default function MobileNav({children}: {children: any}) {
  const [subScreenOpen, setSubScreenOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSubScreenOpen(false);
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <MobileNavHamburger active={subScreenOpen} setOpen={setSubScreenOpen} />
      <MobileNavScreen className="top-nav-height bg-primary" isVisible={subScreenOpen}>
        {children}
      </MobileNavScreen>
    </div>
  );
}