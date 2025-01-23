'use client'

import MobileNavHamburger from "@/components/navigation/header/hamburger/MobileNavHamburger";
import MobileNavScreen from "@/components/navigation/header/MobileNavScreen";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export default function MobileNav({children}: {children: any}) {
  const [isScreenOpen, setIsScreenOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsScreenOpen(false);
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <MobileNavHamburger active={isScreenOpen} setOpen={setIsScreenOpen} />
      <MobileNavScreen isVisible={isScreenOpen}>
        {children}
      </MobileNavScreen>
    </div>
  );
}