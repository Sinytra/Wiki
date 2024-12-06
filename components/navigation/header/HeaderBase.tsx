'use client';

import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";

export default function HeaderBase({unfix, children}: { unfix?: boolean, children: any }) {
  const binding = useRef<HTMLHeadingElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={binding}
      className={cn(
        !unfix && 'fixed left-0 w-[100vw]',
        'bg-background z-50',
        !unfix && scrolled && 'shadow-xl transition-shadow motion-reduce:transition-none'
      )}
    >
      {children}
    </header>
  );
}
