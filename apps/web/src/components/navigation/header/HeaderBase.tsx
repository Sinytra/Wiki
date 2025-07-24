'use client'

import {useEffect, useRef, useState} from "react";
import {cn} from "@repo/ui/lib/utils";

export default function HeaderBase({unfix, children}: { unfix?: boolean, children: any }) {
  const binding = useRef<HTMLHeadingElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    document.addEventListener("scroll", onScroll);

    return () => document.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  return (
    <header className={cn(!unfix && 'fixed left-0 w-[100vw]', 'z-50 border-b border-tertiary bg-primary-alt', !unfix && scrolled && `
      motion-reduce:transition-none
    `)} ref={binding}>
      {children}
    </header>
  )
}